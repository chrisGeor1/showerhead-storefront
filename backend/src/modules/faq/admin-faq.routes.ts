import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../../prisma.js'
import { AppError } from '../../utils/AppError.js'

export const adminFaqRouter = Router()

adminFaqRouter.get('/', async (_req, res) => {
  const items = await prisma.faqItem.findMany({ orderBy: { sortOrder: 'asc' } })
  res.json(items)
})

const FaqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  sortOrder: z.number().int().default(0),
})

adminFaqRouter.post('/', async (req, res) => {
  const input = FaqSchema.parse(req.body)
  const item = await prisma.faqItem.create({ data: input })
  res.status(201).json(item)
})

adminFaqRouter.patch('/:id', async (req, res) => {
  const input = FaqSchema.partial().parse(req.body)
  const item = await prisma.faqItem.update({ where: { id: req.params.id }, data: input }).catch(() => null)
  if (!item) throw AppError.notFound('FAQ item not found')
  res.json(item)
})

adminFaqRouter.delete('/:id', async (req, res) => {
  await prisma.faqItem.delete({ where: { id: req.params.id } }).catch(() => {
    throw AppError.notFound('FAQ item not found')
  })
  res.status(204).end()
})
