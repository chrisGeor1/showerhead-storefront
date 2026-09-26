import { Router } from 'express'
import { prisma } from '../../prisma.js'
import { AppError } from '../../utils/AppError.js'
import { presentVariant, variantInclude } from './variants.presenter.js'

export const variantsRouter = Router()

variantsRouter.get('/', async (_req, res) => {
  const variants = await prisma.variant.findMany({
    where: { active: true },
    include: variantInclude,
    orderBy: { sortOrder: 'asc' },
  })
  res.json(variants.map(presentVariant))
})

variantsRouter.get('/:id', async (req, res) => {
  const variant = await prisma.variant.findUnique({
    where: { id: req.params.id },
    include: variantInclude,
  })
  if (!variant || !variant.active) throw AppError.notFound('Variant not found')
  res.json(presentVariant(variant))
})
