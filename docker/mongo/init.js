// MongoDB initialization script for DreamDot
// Creates collections and indexes based on DATA_SCHEMA.md

db = db.getSiblingDB('dreamdot');

// Create collections with indexes (schema validation with defaults not supported in MongoDB 7.0)

// 1. USER Collection
db.createCollection('users');
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ _id: 1 });

// 2. CONVERSATION Collection
db.createCollection('conversations');
db.conversations.createIndex({ participants: 1 });
db.conversations.createIndex({ lastMessageAt: -1 });
db.conversations.createIndex({ createdBy: 1 });

// 3. MESSAGE Collection
db.createCollection('messages');
db.messages.createIndex({ conversationId: 1, timestamp: -1 });
db.messages.createIndex({ senderId: 1, timestamp: -1 });
db.messages.createIndex({ timestamp: 1 });

// 4. MEMBERSHIP Collection
db.createCollection('memberships');
db.memberships.createIndex({ conversationId: 1, userId: 1 }, { unique: true });

// 5. ATTACHMENT Collection
db.createCollection('attachments');
db.attachments.createIndex({ uploadedBy: 1 });
db.attachments.createIndex({ message: 1 });

// 6. POST Collection
db.createCollection('posts');
db.posts.createIndex({ userId: 1 });
db.posts.createIndex({ sqlId: 1 }, { unique: true });
db.posts.createIndex({ createdAt: -1 });

// 7. ITEM Collection
db.createCollection('items');
db.items.createIndex({ userId: 1 });
db.items.createIndex({ sqlId: 1 }, { unique: true });
db.items.createIndex({ category: 1 });
db.items.createIndex({ visibility: 1 });
db.items.createIndex({ createdAt: -1 });

// 8. TRANSACTION Collection
db.createCollection('transactions');
db.transactions.createIndex({ userId: 1 });
db.transactions.createIndex({ sessionId: 1 }, { sparse: true });
db.transactions.createIndex({ status: 1 });

// 9. SERVER Collection (Community Servers - Discord-style)
db.createCollection('servers');
db.servers.createIndex({ ownerId: 1 });

// 10. BLOCKCHAIN_LEDGER Collection (Immutable)
db.createCollection('blockchain_ledgers');
db.blockchain_ledgers.createIndex({ txHash: 1 }, { unique: true });
db.blockchain_ledgers.createIndex({ timestamp: 1 });

print('✅ MongoDB collections initialized successfully for DreamDot');
print('   Collections created: users, conversations, messages, memberships, attachments, posts, items, transactions, servers, blockchain_ledgers');
