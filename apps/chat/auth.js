const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Simple JWT authentication middleware for Express
function authenticateToken(req, res, next) {
  console.log('AUTH: Authenticating request...');

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('ERROR: No token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('ERROR: Invalid token:', err.message);
      return res.status(403).json({ error: 'Invalid token' });
    }

    console.log('SUCCESS: Token verified for user:', user.sub);
    req.user = user;
    next();
  });
}

// Socket.IO authentication middleware - updated for NextAuth JWT tokens
function authenticateSocket(socket, next) {
  console.log('AUTH: Authenticating socket connection...');

  try {
    const token = socket.handshake.auth?.token ||
                 socket.handshake.query?.token?.replace('Bearer ', '');

    if (!token) {
      console.log('ERROR: No token provided for socket');
      return next(new Error('Authentication error: No token provided'));
    }

    // Verify NextAuth JWT token (it contains the user info)
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('ERROR: Invalid socket token:', err.message);
        return next(new Error('Authentication error: Invalid token'));
      }

      // NextAuth token structure: { id, email, name, image, ... }
      console.log('SUCCESS: Socket authenticated for user:', decoded.id || decoded.sub);
      socket.userId = decoded.id || decoded.sub;
      socket.userEmail = decoded.email;
      next();
    });
  } catch (error) {
    console.log('ERROR: Socket authentication error:', error.message);
    next(new Error('Authentication failed'));
  }
}

// Generate JWT token
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

// Verify if user is member of conversation
async function ensureMember(userId, conversationId) {
  console.log('Checking membership for user:', userId, 'in conversation:', conversationId);

  const { Conversation } = require('@repo/database-mongo');

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  if (!conversation.participants.includes(userId)) {
    throw new Error('User is not a member of this conversation');
  }

  console.log('SUCCESS: User is member of conversation');
  return conversation;
}

module.exports = {
  authenticateToken,
  authenticateSocket,
  generateToken,
  ensureMember
};
