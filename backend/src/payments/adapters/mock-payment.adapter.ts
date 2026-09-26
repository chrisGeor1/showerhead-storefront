import { env } from '../../env.js'
import type {
  InitializeTransactionInput,
  InitializeTransactionResult,
  PaymentAdapter,
  VerifyTransactionResult,
} from './payment-adapter.interface.js'

/**
 * No external system to talk to — the checkout module treats our own
 * Order/Payment rows as the source of truth for mock transactions and
 * updates them directly via POST /api/checkout/mock/:reference/confirm
 * (see checkout module), which is what a real webhook would otherwise do.
 * verifyTransaction here is intentionally never the source of truth; it
 * only exists so the adapter fully implements the shared interface.
 */
export class MockPaymentAdapter implements PaymentAdapter {
  readonly provider = 'MOCK' as const

  async initializeTransaction(input: InitializeTransactionInput): Promise<InitializeTransactionResult> {
    const url = new URL('/checkout/mock', env.CLIENT_ORIGIN)
    url.searchParams.set('reference', input.reference)
    return {
      authorizationUrl: url.toString(),
      accessCode: input.reference,
      reference: input.reference,
    }
  }

  async verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
    return { status: 'pending', reference, amount: 0, currency: 'NGN' }
  }

  verifyWebhookSignature(): boolean {
    return true
  }
}
