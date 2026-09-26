export type PaymentProviderName = 'MOCK' | 'PAYSTACK'

export interface InitializeTransactionInput {
  reference: string
  amount: number // major currency unit, e.g. 54.99
  currency: string
  email: string
  metadata?: Record<string, unknown>
}

export interface InitializeTransactionResult {
  authorizationUrl: string
  accessCode: string
  reference: string
}

export type TransactionStatus = 'success' | 'failed' | 'abandoned' | 'pending'

export interface VerifyTransactionResult {
  status: TransactionStatus
  reference: string
  amount: number
  currency: string
  paidAt?: string
}

/**
 * Abstraction over "who actually charges the card." MockPaymentAdapter is the
 * default so the full checkout flow is testable without live credentials;
 * PaystackPaymentAdapter only activates when PAYSTACK_SECRET_KEY is set.
 */
export interface PaymentAdapter {
  readonly provider: PaymentProviderName
  initializeTransaction(input: InitializeTransactionInput): Promise<InitializeTransactionResult>
  verifyTransaction(reference: string): Promise<VerifyTransactionResult>
  verifyWebhookSignature(rawBody: Buffer, signature: string | undefined): boolean
}
