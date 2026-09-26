import crypto from 'node:crypto'
import path from 'node:path'
import { Router } from 'express'
import multer from 'multer'
import { prisma } from '../../prisma.js'
import { AppError } from '../../utils/AppError.js'
import { storageAdapter } from '../../storage/storage-adapter.factory.js'

export const adminMediaRouter = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB — generous enough for uncompressed demo videos
})

function mediaKindFromMime(mimeType: string): 'IMAGE' | 'VIDEO' {
  if (mimeType.startsWith('video/')) return 'VIDEO'
  return 'IMAGE'
}

adminMediaRouter.get('/', async (_req, res) => {
  const media = await prisma.media.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })
  res.json(media)
})

adminMediaRouter.post('/', upload.single('file'), async (req, res) => {
  const file = req.file
  if (!file) throw AppError.badRequest('No file uploaded (expected multipart field "file")')

  const ext = path.extname(file.originalname) || ''
  const key = `media/${crypto.randomUUID()}${ext}`

  const uploadResult = await storageAdapter.upload({
    key,
    buffer: file.buffer,
    contentType: file.mimetype,
  })

  const media = await prisma.media.create({
    data: {
      key: uploadResult.key,
      url: uploadResult.url,
      mimeType: file.mimetype,
      kind: mediaKindFromMime(file.mimetype),
      sizeBytes: file.size,
    },
  })

  res.status(201).json(media)
})

adminMediaRouter.delete('/:id', async (req, res) => {
  const media = await prisma.media.findUnique({ where: { id: req.params.id } })
  if (!media) throw AppError.notFound('Media not found')

  await prisma.media
    .delete({ where: { id: media.id } })
    .catch(() => {
      throw AppError.conflict('This file is still used by a variant, feature, or gallery item')
    })

  await storageAdapter.delete(media.key)
  res.status(204).end()
})
