import { Router } from 'express'
import { z } from 'zod'
import {
  confirmMockPayment,
  createOrderAndInitializePayment,
  getOrderStatus,
} from './checkout.service.js'
import { AppError } from '../../utils/AppError.js'

export const checkoutRouter = Router()

const CheckoutSchema = z.object({
  items: z
    .array(z.object({ variantId: z.string().min(1), quantity: z.number().int().min(1) }))
    .min(1),
  customerEmail: z.string().email(),
  customerName: z.string().min(1),
})

checkoutRouter.post('/', async (req, res) => {
  const input = CheckoutSchema.parse(req.body)
  const result = await createOrderAndInitializePayment(input)
  res.status(201).json(result)
})

checkoutRouter.get('/verify/:reference', async (req, res) => {
  const order = await getOrderStatus(req.params.reference)
  if (!order) throw AppError.notFound('Order not found')
  res.json({
    reference: order.paystackReference,
    status: order.status,
    subtotal: Number(order.subtotal),
    currency: order.currency,
  })
})

const MockConfirmSchema = z.object({ outcome: z.enum(['success', 'failed']) })

checkoutRouter.post('/mock/:reference/confirm', async (req, res) => {
  const { outcome } = MockConfirmSchema.parse(req.body)
  const order = await confirmMockPayment(req.params.reference, outcome)
  res.json({ reference: order?.paystackReference, status: order?.status })
})
