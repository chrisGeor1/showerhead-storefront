import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../../prisma.js'
import { AppError } from '../../utils/AppError.js'
import { presentVariant, variantInclude } from './variants.presenter.js'

export const adminVariantsRouter = Router()

adminVariantsRouter.get('/', async (_req, res) => {
  const variants = await prisma.variant.findMany({
    include: variantInclude,
    orderBy: { sortOrder: 'asc' },
  })
  res.json(variants.map(presentVariant))
})

adminVariantsRouter.get('/:id', async (req, res) => {
  const variant = await prisma.variant.findUnique({
    where: { id: req.params.id },
    include: variantInclude,
  })
  if (!variant) throw AppError.notFound('Variant not found')
  res.json(presentVariant(variant))
})

const VariantCreateSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'id must be lowercase letters, numbers, and hyphens only'),
  label: z.string().min(1),
  swatch: z.string().min(1),
  productName: z.string().min(1),
  productSummary: z.string().min(1),
  price: z.number().nonnegative(),
  currency: z.string().min(1).default('NGN'),
  active: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  heroEyebrow: z.string().min(1),
  heroHeadline: z.string().min(1),
  heroSubhead: z.string().min(1),
  heroImageId: z.string().min(1),
  heroImageAlt: z.string().min(1),
  heroSecondaryImageId: z.string().min(1),
  heroSecondaryImageAlt: z.string().min(1),
})

const VariantUpdateSchema = VariantCreateSchema.omit({ id: true }).partial()

adminVariantsRouter.post('/', async (req, res) => {
  const input = VariantCreateSchema.parse(req.body)
  const existing = await prisma.variant.findUnique({ where: { id: input.id } })
  if (existing) throw AppError.conflict(`Variant "${input.id}" already exists`)

  const variant = await prisma.variant.create({ data: input, include: variantInclude })
  res.status(201).json(presentVariant(variant))
})

adminVariantsRouter.patch('/:id', async (req, res) => {
  const input = VariantUpdateSchema.parse(req.body)
  const variant = await prisma.variant
    .update({ where: { id: req.params.id }, data: input, include: variantInclude })
    .catch(() => null)
  if (!variant) throw AppError.notFound('Variant not found')
  res.json(presentVariant(variant))
})

adminVariantsRouter.delete('/:id', async (req, res) => {
  await prisma.variant.delete({ where: { id: req.params.id } }).catch(() => {
    throw AppError.notFound('Variant not found')
  })
  res.status(204).end()
})

// --- Features (nested under a variant) ---

const FeatureSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  imageId: z.string().min(1),
  imageAlt: z.string().min(1),
  sortOrder: z.number().int().default(0),
})

adminVariantsRouter.post('/:id/features', async (req, res) => {
  const input = FeatureSchema.parse(req.body)
  const variant = await prisma.variant.findUnique({ where: { id: req.params.id } })
  if (!variant) throw AppError.notFound('Variant not found')

  const feature = await prisma.feature.create({ data: { ...input, variantId: variant.id } })
  res.status(201).json(feature)
})

adminVariantsRouter.patch('/features/:featureId', async (req, res) => {
  const input = FeatureSchema.partial().parse(req.body)
  const feature = await prisma.feature
    .update({ where: { id: req.params.featureId }, data: input })
    .catch(() => null)
  if (!feature) throw AppError.notFound('Feature not found')
  res.json(feature)
})

adminVariantsRouter.delete('/features/:featureId', async (req, res) => {
  await prisma.feature.delete({ where: { id: req.params.featureId } }).catch(() => {
    throw AppError.notFound('Feature not found')
  })
  res.status(204).end()
})

// --- Gallery items (nested under a variant) ---

const GalleryItemSchema = z.object({
  kind: z.enum(['IMAGE', 'VIDEO']),
  mediaId: z.string().min(1),
  posterMediaId: z.string().min(1).optional(),
  alt: z.string().min(1),
  caption: z.string().min(1),
  sortOrder: z.number().int().default(0),
})

adminVariantsRouter.post('/:id/gallery', async (req, res) => {
  const input = GalleryItemSchema.parse(req.body)
  const variant = await prisma.variant.findUnique({ where: { id: req.params.id } })
  if (!variant) throw AppError.notFound('Variant not found')

  const item = await prisma.galleryItem.create({ data: { ...input, variantId: variant.id } })
  res.status(201).json(item)
})

adminVariantsRouter.patch('/gallery/:itemId', async (req, res) => {
  const input = GalleryItemSchema.partial().parse(req.body)
  const item = await prisma.galleryItem
    .update({ where: { id: req.params.itemId }, data: input })
    .catch(() => null)
  if (!item) throw AppError.notFound('Gallery item not found')
  res.json(item)
})

adminVariantsRouter.delete('/gallery/:itemId', async (req, res) => {
  await prisma.galleryItem.delete({ where: { id: req.params.itemId } }).catch(() => {
    throw AppError.notFound('Gallery item not found')
  })
  res.status(204).end()
})
