import { Router } from 'express'
import { z } from 'zod'
import { signAdminToken, verifyAdminCredentials } from './auth.service.js'
import { ADMIN_COOKIE_NAME, requireAdmin } from '../../middleware/requireAdmin.js'
import { env } from '../../env.js'

export const authRouter = Router()

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: env.NODE_ENV === 'production',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

authRouter.post('/login', async (req, res) => {
  const { email, password } = LoginSchema.parse(req.body)
  const admin = await verifyAdminCredentials(email, password)
  const token = signAdminToken({ sub: admin.id, email: admin.email })
  res.cookie(ADMIN_COOKIE_NAME, token, cookieOptions)
  res.json({ id: admin.id, email: admin.email })
})

authRouter.post('/logout', (_req, res) => {
  res.clearCookie(ADMIN_COOKIE_NAME, { path: '/' })
  res.status(204).end()
})

authRouter.get('/me', requireAdmin, (req, res) => {
  res.json(req.admin)
})
