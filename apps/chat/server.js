const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const { connectDb } = require('./db');
const { authenticateToken, authenticateSocket, ensureMember, ensureChannelMember } = require('./auth');
const { prismaCommunity } = require('./prisma-client');
// Use shared models
const { Message, Conversation, User } = require('@repo/database-mongo');

// Debug logging function
function debugLog(message, data = null) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

// Create Express app
const app = express();
const server = http.createServer(app);

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

// Compression middleware
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5000'];
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy (important for production)
app.set('trust proxy', 1);

// Health check endpoint
app.get('/health', (req, res) => {
  // We can assume connected if server is up, or improve this check later
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'chat-server'
  });
});

// API Routes
app.use('/api/v1', authenticateToken);

// Get user conversations
app.get('/api/v1/conversations', async (req, res) => {
  try {
    debugLog('Getting conversations for user:', req.user.sub);

    const conversations = await Conversation.find({
      participants: req.user.sub,
      isArchived: false
    })
      .sort({ lastMessageAt: -1 })
      .limit(50);

    debugLog('SUCCESS: Found conversations:', conversations.length);
    res.json({ success: true, data: conversations });
  } catch (error) {
    debugLog('ERROR: Error getting conversations:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create conversation
app.post('/api/v1/conversations', async (req, res) => {
  try {
    const { type, participants, name } = req.body;
    const userId = req.user.sub;


    if (!type || !participants || !Array.isArray(participants)) {
      return res.status(400).json({ success: false, error: 'Type and participants are required' });
    }

    // For direct messages, check if conversation already exists
    if (type === 'direct' && participants.length === 2) {
      const existingConversation = await Conversation.findOne({
        type: 'direct',
        participants: { $all: participants }
      });

      if (existingConversation) {
        debugLog('SUCCESS: Found existing direct conversation');
        return res.json({ success: true, data: existingConversation });
      }
    }

    const uniqueParticipants = Array.from(new Set([...participants, userId]));

    const conversation = await Conversation.create({
      type,
      participants: uniqueParticipants,
      name: name || `Chat ${new Date().toLocaleDateString()}`,
      createdBy: userId,
      admins: [userId],
      lastMessageAt: new Date(),
    });

    res.json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get messages for a conversation
app.get('/api/v1/conversations/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50, before } = req.query;


    let query = { conversationId: id, isDeleted: false };

    if (before) {
      query.timestamp = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    // .populate('sender', 'name email avatar'); // removed populate for now as User model might not be linked

    debugLog('SUCCESS: Found messages:', messages.length);
    res.json({ success: true, data: messages.reverse() });
  } catch (error) {
    debugLog('ERROR: Error getting messages:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send message (REST API fallback)
app.post('/api/v1/conversations/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, type = 'text', attachments = [] } = req.body;
    const userId = req.user.sub;


    // Check if user is member
    await ensureMember(userId, id);

    // Create message
    const message = await Message.create({
      conversationId: id,
      senderId: userId,
      sender: userId,
      content,
      type,
      attachments,
      readBy: [userId],
      timestamp: new Date()
    });

    // Update conversation's last message
    await Conversation.findByIdAndUpdate(id, {
      lastMessage: message._id,
      lastMessageAt: new Date(),
      $addToSet: { unreadBy: { $each: [] } }, // Reset unreadBy for sender
      $pull: { unreadBy: userId }, // Remove sender from unreadBy
    });

    debugLog('SUCCESS: Message sent:', message._id);
    res.json({ success: true, data: message });
  } catch (error) {
    debugLog('ERROR: Error sending message:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Socket.IO setup
const io = socketIo(server, {
  path: process.env.SOCKET_PATH || '/socket.io',
  cors: corsOptions,
  serveClient: false,
  connectTimeout: 30000,
  pingTimeout: 25000,
  pingInterval: 20000,
  transports: ['polling', 'websocket'],
  allowEIO3: true
});

// Socket connection handler
io.use(authenticateSocket);

// Multi-tab-safe presence: only flip online->offline when a user's LAST socket
// disconnects, not on every tab close. Per-process only — if apps/chat is ever
// scaled to multiple instances, this needs to move to a shared store (e.g. Redis).
const userSocketCounts = new Map();

io.on('connection', async (socket) => {
  debugLog('Socket connected:', socket.userId);

  const openSockets = (userSocketCounts.get(socket.userId) || 0) + 1;
  userSocketCounts.set(socket.userId, openSockets);
  if (openSockets === 1) {
    try {
      await prismaCommunity.presence.upsert({
        where: { user_id: socket.userId },
        update: { status: 'online', last_seen: new Date() },
        create: { user_id: socket.userId, status: 'online', last_seen: new Date() },
      });
      debugLog('Presence: user online:', socket.userId);
    } catch (error) {
      debugLog('ERROR: presence upsert (online) failed:', error.message);
    }
  }

  // Handle room joining
  socket.on('room:join', async (data) => {
    try {
      debugLog('Joining room:', data.conversationId);

      await ensureMember(socket.userId, data.conversationId);
      await socket.join(data.conversationId);

      // Notify others in the room
      socket.to(data.conversationId).emit('presence:join', {
        userId: socket.userId,
        timestamp: new Date().toISOString()
      });

      debugLog('SUCCESS: Joined room:', data.conversationId);
    } catch (error) {
      debugLog('ERROR: Error joining room:', error.message);
      socket.emit('error', { event: 'room:join', message: error.message });
    }
  });

  // Handle room leaving
  socket.on('room:leave', (data) => {
    debugLog('Leaving room:', data.conversationId);

    socket.leave(data.conversationId);
    socket.to(data.conversationId).emit('presence:leave', {
      userId: socket.userId,
      timestamp: new Date().toISOString()
    });

    debugLog('SUCCESS: Left room:', data.conversationId);
  });

  // Handle typing indicators
  socket.on('message:typing', (data) => {
    debugLog('Typing in room:', data.conversationId);

    socket.to(data.conversationId).emit('message:typing', {
      userId: socket.userId,
      isTyping: data.isTyping,
      timestamp: new Date().toISOString()
    });
  });

  // Handle message sending
  // NOTE: the client (apps/web/src/lib/socket.ts emitSendMessage) sends a plaintext
  // `content` field. `ciphertext`/`nonce`/`keyId` remain supported for a future E2E
  // path but nothing produces them today — content is the common case.
  socket.on('message:send', async (data, ack) => {
    try {
      debugLog('Socket message send:', data.conversationId);

      const { conversationId, content, ciphertext, nonce, keyId, attachments = [] } = data;

      if (!content && !ciphertext) {
        throw new Error('Message must include content or ciphertext');
      }

      // Check membership
      await ensureMember(socket.userId, conversationId);

      const savedMessage = await Message.create({
        conversationId,
        senderId: socket.userId,
        content,
        ciphertext,
        nonce,
        keyId,
        type: attachments.length > 0 ? (attachments[0].type.startsWith('image/') ? 'image' : attachments[0].type.startsWith('video/') ? 'video' : 'file') : 'text',
        attachments,
        readBy: [socket.userId],
        timestamp: new Date()
      });

      // Update conversation
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: savedMessage._id,
        lastMessageAt: new Date(),
        $addToSet: { unreadBy: { $each: [] } },
        $pull: { unreadBy: socket.userId },
      });

      const sender = await User.findById(socket.userId).lean();
      const payload = {
        ...savedMessage.toObject(),
        id: savedMessage._id.toString(),
        senderName: sender?.name || 'Unknown',
        senderAvatar: sender?.avatar || '',
        status: 'delivered',
      };

      // Broadcast to room (excluding sender)
      socket.to(conversationId).emit('message:new', payload);

      debugLog('SUCCESS: Message sent and broadcasted:', savedMessage._id);

      if (ack) {
        ack({ ok: true, id: savedMessage._id, message: payload });
      }
    } catch (error) {
      debugLog('ERROR: Error sending socket message:', error.message);
      socket.emit('error', { event: 'message:send', message: error.message });
      if (ack) {
        ack({ ok: false, error: error.message });
      }
    }
  });

  // ============================================================================
  // Community Channel Messaging (real-time)
  // ============================================================================
  // Channel/server/membership structure lives in Postgres (community.schema.prisma,
  // owned by apps/web) — ensureChannelMember reads it via prisma-client.js. Message
  // CONTENT lives in the same Mongo `Message` collection as DMs, distinguished by
  // channelId vs conversationId (see apps/database-mongo/src/models/Message.ts).

  socket.on('channel:join', async (data, ack) => {
    try {
      const { channelId } = data;
      debugLog('Joining channel:', channelId);

      await ensureChannelMember(socket.userId, channelId);
      await socket.join(`channel:${channelId}`);

      socket.to(`channel:${channelId}`).emit('presence:join', {
        userId: socket.userId,
        timestamp: new Date().toISOString(),
      });

      debugLog('SUCCESS: Joined channel:', channelId);
      if (ack) ack({ ok: true });
    } catch (error) {
      debugLog('ERROR: Error joining channel:', error.message);
      socket.emit('error', { event: 'channel:join', message: error.message });
      if (ack) ack({ ok: false, error: error.message });
    }
  });

  socket.on('channel:leave', (data) => {
    const { channelId } = data;
    debugLog('Leaving channel:', channelId);

    socket.leave(`channel:${channelId}`);
    socket.to(`channel:${channelId}`).emit('presence:leave', {
      userId: socket.userId,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on('channel:message:send', async (data, ack) => {
    try {
      const { channelId, content, attachments = [] } = data;
      debugLog('Channel message send:', channelId);

      if (!content || typeof content !== 'string' || content.length === 0 || content.length > 4000) {
        throw new Error('Message content must be 1-4000 characters');
      }

      await ensureChannelMember(socket.userId, channelId);

      const savedMessage = await Message.create({
        channelId,
        senderId: socket.userId,
        content,
        type: 'text',
        attachments,
        readBy: [socket.userId],
        timestamp: new Date(),
      });

      const sender = await User.findById(socket.userId).lean();
      const payload = {
        ...savedMessage.toObject(),
        id: savedMessage._id.toString(),
        senderName: sender?.name || 'Unknown',
        senderAvatar: sender?.avatar || '',
      };

      socket.to(`channel:${channelId}`).emit('channel:message:new', payload);

      debugLog('SUCCESS: Channel message sent and broadcasted:', savedMessage._id);
      if (ack) ack({ ok: true, id: savedMessage._id, message: payload });
    } catch (error) {
      debugLog('ERROR: Error sending channel message:', error.message);
      socket.emit('error', { event: 'channel:message:send', message: error.message });
      if (ack) ack({ ok: false, error: error.message });
    }
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    debugLog('Socket disconnected:', socket.userId);

    const remaining = (userSocketCounts.get(socket.userId) || 1) - 1;
    if (remaining <= 0) {
      userSocketCounts.delete(socket.userId);
      try {
        await prismaCommunity.presence.upsert({
          where: { user_id: socket.userId },
          update: { status: 'offline', last_seen: new Date() },
          create: { user_id: socket.userId, status: 'offline', last_seen: new Date() },
        });
        debugLog('Presence: user offline:', socket.userId);
      } catch (error) {
        debugLog('ERROR: presence upsert (offline) failed:', error.message);
      }
    } else {
      userSocketCounts.set(socket.userId, remaining);
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  debugLog('Express error:', err.message);
  res.status(500).json({
    success: false,
    error: err.message
  });
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  debugLog(`SHUTDOWN: Received ${signal}. Shutting down gracefully...`);

  server.close(async () => {
    debugLog('SHUTDOWN: HTTP server closed');

    try {
      // Disconnect DB
      const { disconnectDatabase } = require('@repo/database-mongo');
      await disconnectDatabase();
      debugLog('SHUTDOWN: Database connection closed');
    } catch (error) {
      debugLog('ERROR: Error closing database connection:', error.message);
    }

    debugLog('SHUTDOWN: Process terminated');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    debugLog('ERROR: Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  debugLog('ERROR: Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  debugLog('ERROR: Uncaught Exception:', error.message);
  process.exit(1);
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to database (non-blocking)
    await connectDb();

    const PORT = parseInt(process.env.PORT || '3001', 10);
    const HOST = process.env.HOST || '0.0.0.0';

    server.listen(PORT, HOST, () => {
      debugLog(`SERVER: Chat server running on ${HOST}:${PORT}`);
      debugLog(`INFO: Environment: ${process.env.NODE_ENV || 'development'}`);
      debugLog(`INFO: Socket.IO path: ${process.env.SOCKET_PATH || '/socket.io'}`);
    });

  } catch (error) {
    debugLog('ERROR: Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = { app, server, io };
