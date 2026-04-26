const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') })

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { connectToDatabase } = require('@repo/database-mongo')

const paymentRoutes = require('./routes/payment')
const webhookRoutes = require('./routes/webhook')

const app = express()
const PORT = Number(process.env.PAYMENT_PORT || 3002)
const HOST = process.env.PAYMENT_HOST || '0.0.0.0'

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
)

app.use('/webhook', bodyParser.raw({ type: 'application/json' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'payment', timestamp: new Date().toISOString() })
})

app.use('/api/payment', paymentRoutes)
app.use('/webhook', webhookRoutes)

app.use((err, req, res, next) => {
  console.error('Payment service error:', err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

async function start() {
  await connectToDatabase(process.env.MONGODB_URI || process.env.MONGO_CLUSTER)

  app.listen(PORT, HOST, () => {
    console.log(`Payment service listening on ${HOST}:${PORT}`)
  })
}

start().catch((error) => {
  console.error('Failed to boot payment service:', error)
  process.exit(1)
})

module.exports = app
