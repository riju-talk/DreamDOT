const express = require('express')
const router = express.Router()
const Stripe = require('stripe')
const { Transaction, User } = require('@repo/database-mongo')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

router.post('/stripe', async (req, res) => {
  const signature = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object

        const transaction = await Transaction.findOne({ sessionId: session.id })
        if (!transaction) {
          break
        }

        if (transaction.status !== 'completed') {
          transaction.status = 'completed'
          transaction.stripePaymentIntentId = session.payment_intent
          transaction.updatedAt = new Date()
          await transaction.save()

          await User.updateOne({ _id: transaction.userId }, { $inc: { credits: transaction.amount } })
        }

        break
      }

      case 'checkout.session.expired': {
        const expiredSession = event.data.object
        await Transaction.findOneAndUpdate(
          { sessionId: expiredSession.id, status: 'pending' },
          { status: 'expired', updatedAt: new Date() }
        )
        break
      }

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return res.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return res.status(500).json({ error: 'Webhook handler failed' })
  }
})

module.exports = router
