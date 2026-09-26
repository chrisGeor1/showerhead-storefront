import crypto from 'node:crypto'
import type {
  InitializeTransactionInput,
  InitializeTransactionResult,
  PaymentAdapter,
  TransactionStatus,
  VerifyTransactionResult,
} from './payment-adapter.interface.js'

const PAYSTACK_API_BASE = 'https://api.paystack.co'

interface PaystackInitializeResponse {
  status: boolean
  message: string
  data: { authorization_url: string; access_code: string; reference: string }
}

interface PaystackVerifyResponse {
  status: boolean
  message: string
  data: {
    status: string
    reference: string
    amount: number
    currency: string
    paid_at: string | null
  }
}

function mapStatus(paystackStatus: string): TransactionStatus {
  switch (paystackStatus) {
    case 'success':
      return 'success'
    case 'failed':
      return 'failed'
    case 'abandoned':
      return 'abandoned'
    default:
      return 'pending'
  }
}

export class PaystackPaymentAdapter implements PaymentAdapter {
  readonly provider = 'PAYSTACK' as const
  private readonly secretKey: string

  constructor(secretKey: string) {
    if (!secretKey) {
      throw new Error('PaystackPaymentAdapter requires a non-empty secret key')
    }
    this.secretKey = secretKey
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${PAYSTACK_API_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    })
    const body = (await response.json()) as { status: boolean; message: string }
    if (!response.ok || !body.status) {
      throw new Error(`Paystack request failed: ${body.message ?? response.statusText}`)
    }
    return body as T
  }

  async initializeTransaction(input: InitializeTransactionInput): Promise<InitializeTransactionResult> {
    const result = await this.request<PaystackInitializeResponse>('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email: input.email,
        amount: Math.round(input.amount * 100), // kobo
        currency: input.currency,
        reference: input.reference,
        metadata: input.metadata ?? {},
      }),
    })
    return {
      authorizationUrl: result.data.authorization_url,
      accessCode: result.data.access_code,
      reference: result.data.reference,
    }
  }

  async verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
    const result = await this.request<PaystackVerifyResponse>(
      `/transaction/verify/${encodeURIComponent(reference)}`,
    )
    return {
      status: mapStatus(result.data.status),
      reference: result.data.reference,
      amount: result.data.amount / 100,
      currency: result.data.currency,
      paidAt: result.data.paid_at ?? undefined,
    }
  }

  verifyWebhookSignature(rawBody: Buffer, signature: string | undefined): boolean {
    if (!signature) return false
    const expected = crypto.createHmac('sha512', this.secretKey).update(rawBody).digest('hex')
    const expectedBuf = Buffer.from(expected, 'utf8')
    const signatureBuf = Buffer.from(signature, 'utf8')
    if (expectedBuf.length !== signatureBuf.length) return false
    return crypto.timingSafeEqual(expectedBuf, signatureBuf)
  }
}
