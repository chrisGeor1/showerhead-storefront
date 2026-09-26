import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../prisma.js'
import { env } from '../../env.js'
import { AppError } from '../../utils/AppError.js'

export interface AdminTokenPayload {
  sub: string
  email: string
}

export async function verifyAdminCredentials(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email } })
  if (!admin) throw AppError.unauthorized('Invalid email or password')

  const valid = await bcrypt.compare(password, admin.passwordHash)
  if (!valid) throw AppError.unauthorized('Invalid email or password')

  return admin
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_TTL as jwt.SignOptions['expiresIn'] })
}

export function verifyAdminToken(token: string): AdminTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AdminTokenPayload
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}
