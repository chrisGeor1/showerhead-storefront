import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../../prisma.js'

export const adminSettingsRouter = Router()

const NavLinkSchema = z.object({ label: z.string().min(1), href: z.string().min(1) })
const FooterLinkGroupSchema = z.array(NavLinkSchema)

const SettingsUpdateSchema = z.object({
  brandName: z.string().min(1).optional(),
  brandTagline: z.string().min(1).optional(),
  navLinks: z.array(NavLinkSchema).optional(),
  footerLinks: z
    .object({
      shop: FooterLinkGroupSchema,
      support: FooterLinkGroupSchema,
      legal: FooterLinkGroupSchema,
    })
    .optional(),
  faviconMediaId: z.string().min(1).nullable().optional(),
})

adminSettingsRouter.get('/', async (_req, res) => {
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default' },
    include: { faviconMedia: true },
  })
  res.json(settings)
})

adminSettingsRouter.put('/', async (req, res) => {
  const input = SettingsUpdateSchema.parse(req.body)
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: input,
    create: { id: 'default', ...input },
    include: { faviconMedia: true },
  })
  res.json(settings)
})
