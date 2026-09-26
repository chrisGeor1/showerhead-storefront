import 'dotenv/config'
import { createApp } from './app.js'
import { env } from './env.js'
import { initStorage } from './storage/storage-adapter.factory.js'
import { paymentAdapter } from './payments/payment-adapter.factory.js'

async function main() {
  await initStorage()

  const app = createApp()
  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${env.PORT}`)
    // eslint-disable-next-line no-console
    console.log(`Payment provider: ${paymentAdapter.provider}`)
  })
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err)
  process.exit(1)
})
