import { Router } from 'express'
import { prisma } from '../../prisma.js'

export const settingsRouter = Router()

settingsRouter.get('/', async (_req, res) => {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'default' },
    include: { faviconMedia: true },
  })
  if (!settings) {
    res.json({
      brandName: 'VORTEX',
      brandTagline: 'Shower Spray Attachments',
      navLinks: [],
      footerLinks: {},
      faviconUrl: null,
    })
    return
  }
  res.json({
    brandName: settings.brandName,
    brandTagline: settings.brandTagline,
    navLinks: settings.navLinks,
    footerLinks: settings.footerLinks,
    faviconUrl: settings.faviconMedia?.url ?? null,
  })
})
