const jwt = require('jsonwebtoken')

const authenticateRequest = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' })
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' })
  }
}

const validateUserAccess = (req, res, next) => {
  const { userId } = req.body

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' })
  }

  const requesterId = req.user.id || req.user.sub
  if (requesterId !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Cannot perform action for another user' })
  }

  next()
}

module.exports = { authenticateRequest, validateUserAccess }
