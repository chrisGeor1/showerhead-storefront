import { env } from '../env.js'
import type { PaymentAdapter } from './adapters/payment-adapter.interface.js'
import { MockPaymentAdapter } from './adapters/mock-payment.adapter.js'
import { PaystackPaymentAdapter } from './adapters/paystack-payment.adapter.js'

function createPaymentAdapter(): PaymentAdapter {
  const wantsPaystack = env.PAYMENT_PROVIDER === 'paystack'
  const hasKey = Boolean(env.PAYSTACK_SECRET_KEY)

  if (wantsPaystack && hasKey) {
    return new PaystackPaymentAdapter(env.PAYSTACK_SECRET_KEY)
  }

  if (wantsPaystack && !hasKey) {
    // eslint-disable-next-line no-console
    console.warn(
      'PAYMENT_PROVIDER=paystack but PAYSTACK_SECRET_KEY is not set — falling back to MockPaymentAdapter.',
    )
  }

  return new MockPaymentAdapter()
}

export const paymentAdapter: PaymentAdapter = createPaymentAdapter()
