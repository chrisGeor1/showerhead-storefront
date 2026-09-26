import crypto from 'node:crypto'
import { prisma } from '../../prisma.js'
import { AppError } from '../../utils/AppError.js'
import { paymentAdapter } from '../../payments/payment-adapter.factory.js'

export interface CheckoutItemInput {
  variantId: string
  quantity: number
}

export interface CheckoutInput {
  items: CheckoutItemInput[]
  customerEmail: string
  customerName: string
}

function generateReference(): string {
  return `vx_${crypto.randomBytes(12).toString('hex')}`
}

function fetchOrderByReference(reference: string) {
  return prisma.order.findUnique({
    where: { paystackReference: reference },
    include: { payment: true, items: true },
  })
}

export async function createOrderAndInitializePayment(input: CheckoutInput) {
  if (input.items.length === 0) throw AppError.badRequest('Cart is empty')

  const variantIds = input.items.map((item) => item.variantId)
  const variants = await prisma.variant.findMany({ where: { id: { in: variantIds }, active: true } })
  const variantById = new Map(variants.map((v) => [v.id, v]))

  const lineItems = input.items.map((item) => {
    const variant = variantById.get(item.variantId)
    if (!variant) throw AppError.badRequest(`Unknown or inactive variant: ${item.variantId}`)
    if (item.quantity < 1) throw AppError.badRequest('Quantity must be at least 1')

    const unitPrice = Number(variant.price)
    return {
      variantId: variant.id,
      labelSnapshot: variant.productName,
      unitPriceSnapshot: unitPrice,
      quantity: item.quantity,
      lineTotal: Number((unitPrice * item.quantity).toFixed(2)),
    }
  })

  const subtotal = Number(lineItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2))
  const currency = variants[0]?.currency ?? 'NGN'
  const reference = generateReference()

  const order = await prisma.order.create({
    data: {
      customerEmail: input.customerEmail,
      customerName: input.customerName,
      subtotal,
      currency,
      paystackReference: reference,
      items: { create: lineItems },
    },
  })

  const initResult = await paymentAdapter.initializeTransaction({
    reference,
    amount: subtotal,
    currency,
    email: input.customerEmail,
    metadata: { orderId: order.id },
  })

  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: paymentAdapter.provider,
      providerRef: initResult.reference,
      status: 'PENDING',
    },
  })

  return { orderId: order.id, reference, authorizationUrl: initResult.authorizationUrl }
}

export async function markOrderPaid(reference: string, rawWebhookPayload?: unknown) {
  const order = await prisma.order.findUnique({ where: { paystackReference: reference } })
  if (!order) return
  await prisma.$transaction([
    prisma.order.update({ where: { id: order.id }, data: { status: 'PAID', paidAt: new Date() } }),
    prisma.payment.update({
      where: { orderId: order.id },
      data: { status: 'SUCCEEDED', rawWebhookPayload: rawWebhookPayload as never },
    }),
  ])
}

export async function markOrderFailed(reference: string) {
  const order = await prisma.order.findUnique({ where: { paystackReference: reference } })
  if (!order) return
  await prisma.$transaction([
    prisma.order.update({ where: { id: order.id }, data: { status: 'FAILED' } }),
    prisma.payment.update({ where: { orderId: order.id }, data: { status: 'FAILED' } }),
  ])
}

/**
 * Reads current order/payment state. If it's a still-pending Paystack
 * transaction, polls Paystack once and syncs before returning — this is a
 * safety net for the return-page call; the webhook remains the primary,
 * authoritative path. Mock orders never sync here (see confirmMockPayment).
 */
export async function getOrderStatus(reference: string) {
  const order = await fetchOrderByReference(reference)
  if (!order) throw AppError.notFound('Order not found')

  if (order.status === 'PENDING' && order.payment?.provider === 'PAYSTACK') {
    const result = await paymentAdapter.verifyTransaction(reference)
    if (result.status === 'success') {
      await markOrderPaid(reference)
    } else if (result.status === 'failed' || result.status === 'abandoned') {
      await markOrderFailed(reference)
    }
    return fetchOrderByReference(reference)
  }

  return order
}

export async function confirmMockPayment(reference: string, outcome: 'success' | 'failed') {
  const order = await fetchOrderByReference(reference)
  if (!order) throw AppError.notFound('Order not found')
  if (order.payment?.provider !== 'MOCK') {
    throw AppError.badRequest('This order was not created with the mock payment provider')
  }

  if (outcome === 'success') {
    await markOrderPaid(reference, { simulated: true })
  } else {
    await markOrderFailed(reference)
  }

  return fetchOrderByReference(reference)
}
