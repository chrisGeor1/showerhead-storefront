import type { NextFunction, Request, Response } from 'express'
import { verifyAdminToken } from '../modules/auth/auth.service.js'
import { AppError } from '../utils/AppError.js'

export const ADMIN_COOKIE_NAME = 'vortex_admin_token'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: { id: string; email: string }
    }
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[ADMIN_COOKIE_NAME]
  if (!token) return next(AppError.unauthorized('Admin authentication required'))

  try {
    const payload = verifyAdminToken(token)
    req.admin = { id: payload.sub, email: payload.email }
    next()
  } catch {
    next(AppError.unauthorized('Invalid or expired session'))
  }
}
