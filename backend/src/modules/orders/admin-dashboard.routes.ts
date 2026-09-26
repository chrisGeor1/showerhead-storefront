import { Router } from 'express'
import { prisma } from '../../prisma.js'

export const adminDashboardRouter = Router()

adminDashboardRouter.get('/', async (_req, res) => {
  const [orderCount, paidAggregate, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: { in: ['PAID', 'FULFILLED'] } },
      _sum: { subtotal: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { items: true },
    }),
  ])

  res.json({
    orderCount,
    revenueTotal: Number(paidAggregate._sum.subtotal ?? 0),
    recentOrders,
  })
})
