import { Router } from 'express'
import { paymentAdapter } from '../../payments/payment-adapter.factory.js'
import { markOrderFailed, markOrderPaid } from './checkout.service.js'

export const webhooksRouter = Router()

interface PaystackWebhookEvent {
  event: string
  data: { reference: string; status: string }
}

// Mounted with express.raw() in app.ts so req.body is the raw Buffer needed
// for signature verification — do not add express.json() upstream of this route.
webhooksRouter.post('/paystack', async (req, res) => {
  const signature = req.header('x-paystack-signature')
  const rawBody = req.body as Buffer

  if (!paymentAdapter.verifyWebhookSignature(rawBody, signature)) {
    res.status(401).json({ error: 'Invalid signature' })
    return
  }

  const event = JSON.parse(rawBody.toString('utf8')) as PaystackWebhookEvent

  if (event.event === 'charge.success') {
    await markOrderPaid(event.data.reference, event)
  } else if (event.event === 'charge.failed') {
    await markOrderFailed(event.data.reference)
  }

  res.status(200).json({ received: true })
})
