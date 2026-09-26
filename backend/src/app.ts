import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { env } from './env.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { requireAdmin } from './middleware/requireAdmin.js'

import { authRouter } from './modules/auth/auth.routes.js'
import { variantsRouter } from './modules/variants/variants.routes.js'
import { adminVariantsRouter } from './modules/variants/admin-variants.routes.js'
import { faqRouter } from './modules/faq/faq.routes.js'
import { adminFaqRouter } from './modules/faq/admin-faq.routes.js'
import { settingsRouter } from './modules/settings/settings.routes.js'
import { adminSettingsRouter } from './modules/settings/admin-settings.routes.js'
import { adminMediaRouter } from './modules/media/admin-media.routes.js'
import { checkoutRouter } from './modules/checkout/checkout.routes.js'
import { webhooksRouter } from './modules/checkout/webhooks.routes.js'
import { adminOrdersRouter } from './modules/orders/admin-orders.routes.js'
import { adminDashboardRouter } from './modules/orders/admin-dashboard.routes.js'

export function createApp() {
  const app = express()

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
  app.use(cors({ origin: [env.CLIENT_ORIGIN, env.ADMIN_ORIGIN], credentials: true }))
  app.use(cookieParser())

  // Webhook route needs the raw request body for signature verification —
  // must be mounted before the global express.json() below.
  app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhooksRouter)

  app.use(express.json())

  if (env.STORAGE_PROVIDER === 'local') {
    app.use('/uploads', express.static(env.STORAGE_LOCAL_DIR))
  }

  app.get('/api/health', (_req, res) => res.json({ ok: true }))

  // Public
  app.use('/api/variants', variantsRouter)
  app.use('/api/settings', settingsRouter)
  app.use('/api/faq', faqRouter)
  app.use('/api/checkout', checkoutRouter)

  // Admin
  app.use('/api/admin/auth', authRouter)
  app.use('/api/admin/variants', requireAdmin, adminVariantsRouter)
  app.use('/api/admin/faq', requireAdmin, adminFaqRouter)
  app.use('/api/admin/settings', requireAdmin, adminSettingsRouter)
  app.use('/api/admin/media', requireAdmin, adminMediaRouter)
  app.use('/api/admin/orders', requireAdmin, adminOrdersRouter)
  app.use('/api/admin/dashboard', requireAdmin, adminDashboardRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
