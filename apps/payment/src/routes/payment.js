const express = require('express')
const router = express.Router()
const Stripe = require('stripe')
const { Transaction, User } = require('@repo/database-mongo')
const { authenticateRequest, validateUserAccess } = require('../middleware/auth')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

router.post('/create-checkout-session', authenticateRequest, validateUserAccess, async (req, res) => {
  try {
    const { amount, userId, type } = req.body
    const normalizedAmount = Number(amount)

    if (!Number.isFinite(normalizedAmount) || !userId) {
      return res.status(400).json({ error: 'Valid amount and userId are required' })
    }

    if (normalizedAmount <= 0 || normalizedAmount > 10000) {
      return res.status(400).json({ error: 'Amount must be between 0.01 and 10000 credits' })
    }

    const finalAmount = Math.round(normalizedAmount * 100) / 100

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: type === 'replenish' ? 'DreamDOT Credit Top-up' : 'DreamDOT Purchase',
              description: `Credit amount: ${finalAmount}`,
            },
            unit_amount: Math.round(finalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/settings?payment=success`,
      cancel_url: `${process.env.CLIENT_URL}/settings?payment=cancelled`,
      client_reference_id: userId,
      metadata: {
        userId,
        type: type || 'replenish',
        amount: finalAmount.toString(),
      },
    })

    const transaction = new Transaction({
      userId,
      sessionId: session.id,
      amount: finalAmount,
      type: type || 'replenish',
      status: 'pending',
      metadata: { source: 'stripe_checkout' },
    })

    await transaction.save()

    return res.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Create checkout session error:', error)
    return res.status(500).json({ error: 'Failed to create checkout session' })
  }
})

router.post('/spend-credits', authenticateRequest, validateUserAccess, async (req, res) => {
  try {
    const { userId, amount, metadata } = req.body
    const spendAmount = Number(amount)

    if (!userId || !Number.isFinite(spendAmount) || spendAmount <= 0) {
      return res.status(400).json({ error: 'userId and positive amount are required' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (user.credits < spendAmount) {
      return res.status(400).json({ error: 'Insufficient credits' })
    }

    user.credits -= spendAmount
    await user.save()

    await Transaction.create({
      userId,
      amount: -spendAmount,
      type: 'purchase',
      status: 'completed',
      metadata: metadata || { source: 'credit_spend' },
    })

    return res.json({ success: true, credits: user.credits })
  } catch (error) {
    console.error('Spend credits error:', error)
    return res.status(500).json({ error: 'Failed to spend credits' })
  }
})

router.get('/transactions/:userId', authenticateRequest, async (req, res) => {
  try {
    const { userId } = req.params

    if (req.user.id !== userId && req.user.sub !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Forbidden: Cannot view another user's transactions" })
    }

    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 }).limit(100)

    return res.json({ transactions })
  } catch (error) {
    console.error('Fetch transactions error:', error)
    return res.status(500).json({ error: 'Failed to fetch transactions' })
  }
})

module.exports = router
