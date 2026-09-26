import { Router } from 'express'
import { prisma } from '../../prisma.js'

export const faqRouter = Router()

faqRouter.get('/', async (_req, res) => {
  const items = await prisma.faqItem.findMany({ orderBy: { sortOrder: 'asc' } })
  res.json(items.map((item) => ({ id: item.id, question: item.question, answer: item.answer })))
})
