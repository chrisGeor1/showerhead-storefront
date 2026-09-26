import { z } from 'zod'

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  PUBLIC_API_URL: z.string().default('http://localhost:4000'),
  CLIENT_ORIGIN: z.string().min(1).default('http://localhost:5173'),
  ADMIN_ORIGIN: z.string().min(1).default('http://localhost:5174'),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_TTL: z.string().default('7d'),

  PAYMENT_PROVIDER: z.enum(['mock', 'paystack']).default('mock'),
  PAYSTACK_SECRET_KEY: z.string().optional().default(''),
  PAYSTACK_PUBLIC_KEY: z.string().optional().default(''),

  STORAGE_PROVIDER: z.enum(['local', 'minio']).default('minio'),
  STORAGE_ENDPOINT: z.string().default('http://localhost:9000'),
  STORAGE_PUBLIC_URL: z.string().default('http://localhost:9000/vortex-media'),
  STORAGE_REGION: z.string().default('us-east-1'),
  STORAGE_BUCKET: z.string().default('vortex-media'),
  STORAGE_ACCESS_KEY: z.string().default('vortex'),
  STORAGE_SECRET_KEY: z.string().default('vortex-secret'),
  STORAGE_LOCAL_DIR: z.string().default('uploads'),

  ADMIN_SEED_EMAIL: z.string().email().default('admin@vortex.local'),
  ADMIN_SEED_PASSWORD: z.string().min(8).default('change-me-please'),
})

export type Env = z.infer<typeof EnvSchema>

function loadEnv(): Env {
  const parsed = EnvSchema.safeParse(process.env)
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    // eslint-disable-next-line no-console
    console.error(`Invalid environment configuration:\n${issues.join('\n')}`)
    process.exit(1)
  }
  return parsed.data
}

export const env = loadEnv()
