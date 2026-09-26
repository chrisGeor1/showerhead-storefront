import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../../prisma.js'
import { AppError } from '../../utils/AppError.js'

export const adminOrdersRouter = Router()

adminOrdersRouter.get('/', async (_req, res) => {
  const orders = await prisma.order.findMany({
    include: { items: true, payment: true },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })
  res.json(orders)
})

adminOrdersRouter.get('/:id', async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: true, payment: true },
  })
  if (!order) throw AppError.notFound('Order not found')
  res.json(order)
})

const OrderUpdateSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'FAILED', 'FULFILLED', 'CANCELLED']),
})

adminOrdersRouter.patch('/:id', async (req, res) => {
  const { status } = OrderUpdateSchema.parse(req.body)
  const order = await prisma.order
    .update({ where: { id: req.params.id }, data: { status }, include: { items: true, payment: true } })
    .catch(() => null)
  if (!order) throw AppError.notFound('Order not found')
  res.json(order)
})
