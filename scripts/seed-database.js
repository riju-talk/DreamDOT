#!/usr/bin/env node

/**
 * Database Seeding Script
 * Generates fake data for development and testing
 * 
 * Usage: node scripts/seed-database.js [--clear]
 * 
 * Flags:
 *   --clear    Clear existing data before seeding
 */

import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dreamdot';

console.log('🌱 Database Seeding Script');
console.log('========================\n');

// Define schemas for seeding
const userSchema = new mongoose.Schema({
  _id: String,
  email: String,
  name: String,
  avatar: String,
  bio: String,
  location: String,
  website: String,
  credits: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  library: Array,
  privacy: Object,
  notifications: Object,
  followers: Array,
  following: Array,
  blockedUsers: Array,
  connectedServices: Object,
  accountStatus: String,
  createdAt: Date,
  updatedAt: Date,
}, { strict: false });

const postSchema = new mongoose.Schema({
  userId: String,
  title: String,
  content: String,
  media: Array,
  visibility: Boolean,
  likes: Array,
  comments: Array,
  shares: { type: Number, default: 0 },
  saves: Array,
  category: String,
  tags: Array,
  engagementScore: Number,
  isSponsored: Boolean,
  isFeatured: Boolean,
  createdAt: Date,
  updatedAt: Date,
}, { strict: false });

const itemSchema = new mongoose.Schema({
  userId: String,
  title: String,
  description: String,
  category: String,
  price: Number,
  visibility: String,
  media: Array,
  rating: Number,
  reviews: Number,
  sales: Number,
  purchases: Array,
  tags: Array,
  featured: Boolean,
  drm: Object,
  monetizationType: String,
  createdAt: Date,
  updatedAt: Date,
}, { strict: false });

const conversationSchema = new mongoose.Schema({
  participants: Array,
  lastMessage: Object,
  unreadCount: Object,
  createdAt: Date,
  updatedAt: Date,
}, { strict: false });

const messageSchema = new mongoose.Schema({
  conversationId: String,
  senderId: String,
  content: String,
  attachments: Array,
  isRead: Boolean,
  readAt: Date,
  createdAt: Date,
}, { strict: false });

const transactionSchema = new mongoose.Schema({
  userId: String,
  type: String, // 'purchase', 'earned', 'refund', 'topup'
  amount: Number,
  itemId: String,
  description: String,
  status: String,
  createdAt: Date,
}, { strict: false });

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Item = mongoose.model('Item', itemSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);
const Message = mongoose.model('Message', messageSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

// Test account credentials
const TEST_ACCOUNTS = [
  {
    id: 'user_demo_1',
    email: 'alice@example.com',
    name: 'Alice Creator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
  },
  {
    id: 'user_demo_2',
    email: 'bob@example.com',
    name: 'Bob Explorer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
  },
  {
    id: 'user_demo_3',
    email: 'charlie@example.com',
    name: 'Charlie Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
  },
  {
    id: 'user_demo_4',
    email: 'diana@example.com',
    name: 'Diana Writer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diana',
  },
  {
    id: 'user_demo_5',
    email: 'eve@example.com',
    name: 'Eve Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eve',
  },
];

async function seedDatabase() {
  try {
    console.log(`📡 Connecting to MongoDB at ${MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@')}`);
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Connected to MongoDB\n');

    const shouldClear = process.argv.includes('--clear');

    if (shouldClear) {
      console.log('🗑️  Clearing existing data...');
      await User.deleteMany({});
      await Post.deleteMany({});
      await Item.deleteMany({});
      await Conversation.deleteMany({});
      await Message.deleteMany({});
      await Transaction.deleteMany({});
      console.log('✅ Data cleared\n');
    }

    // Seed Users
    console.log('👥 Seeding users...');
    const users = [];
    for (const account of TEST_ACCOUNTS) {
      const user = {
        _id: account.id,
        email: account.email,
        name: account.name,
        avatar: account.avatar,
        bio: faker.lorem.sentence(),
        location: faker.location.city(),
        website: faker.internet.url(),
        credits: faker.number.int({ min: 100, max: 10000 }),
        totalEarned: faker.number.int({ min: 0, max: 5000 }),
        totalSpent: faker.number.int({ min: 0, max: 3000 }),
        library: [],
        privacy: {
          profileVisibility: 'public',
          showEmail: false,
          allowMessages: true,
          allowNotifications: true,
        },
        followers: [],
        following: [],
        blockedUsers: [],
        accountStatus: 'active',
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      };
      users.push(user);
    }

    await User.insertMany(users, { ordered: false });
    console.log(`✅ Created ${users.length} users\n`);

    // Create follow relationships
    console.log('🔗 Creating follow relationships...');
    for (let i = 0; i < users.length; i++) {
      const currentUser = users[i];
      const followCount = faker.number.int({ min: 1, max: 3 });
      const indicesToFollow = Array.from({ length: followCount }, () =>
        faker.number.int({ min: 0, max: users.length - 1 })
      ).filter(idx => idx !== i);

      for (const idx of indicesToFollow) {
        const followUser = users[idx];
        currentUser.following.push(followUser._id);
        followUser.followers.push(currentUser._id);
      }
    }

    for (const user of users) {
      await User.updateOne({ _id: user._id }, user);
    }
    console.log('✅ Follow relationships created\n');

    // Seed Posts
    console.log('📝 Seeding posts...');
    const posts = [];
    const categories = ['general', 'writing', 'design', 'development', 'art', 'music'];
    
    for (let i = 0; i < 25; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const post = {
        userId: user._id,
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(2),
        media: [
          {
            type: 'image',
            url: `https://picsum.photos/600/400?random=${i}`,
            alt: 'Post image',
          },
        ],
        visibility: true,
        likes: users
          .slice(0, faker.number.int({ min: 1, max: users.length }))
          .map(u => u._id),
        comments: [
          {
            userId: users[Math.floor(Math.random() * users.length)]._id,
            text: faker.lorem.sentence(),
            timestamp: faker.date.recent(),
          },
        ],
        shares: faker.number.int({ min: 0, max: 50 }),
        saves: users
          .slice(0, faker.number.int({ min: 0, max: Math.floor(users.length / 2) }))
          .map(u => u._id),
        category: categories[Math.floor(Math.random() * categories.length)],
        tags: [faker.word.noun(), faker.word.noun(), faker.word.adjective()],
        engagementScore: faker.number.int({ min: 0, max: 500 }),
        isSponsored: Math.random() > 0.9,
        isFeatured: Math.random() > 0.8,
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: new Date(),
      };
      posts.push(post);
    }

    await Post.insertMany(posts, { ordered: false });
    console.log(`✅ Created ${posts.length} posts\n`);

    // Seed Items (Digital Products)
    console.log('🛍️  Seeding items...');
    const items = [];
    const itemCategories = ['writing', 'illustration', 'audio', 'video', 'research', 'design', 'code', 'template'];
    
    for (let i = 0; i < 15; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const item = {
        userId: user._id,
        title: faker.commerce.productName(),
        description: faker.lorem.paragraphs(1),
        category: itemCategories[Math.floor(Math.random() * itemCategories.length)],
        price: faker.number.int({ min: 10, max: 500 }),
        visibility: 'public',
        media: [
          {
            url: `https://picsum.photos/300/300?random=${i + 100}`,
            mimeType: 'image/jpeg',
            size: faker.number.int({ min: 10000, max: 500000 }),
            width: 300,
            height: 300,
          },
        ],
        rating: faker.number.float({ min: 3, max: 5, precision: 0.1 }),
        reviews: faker.number.int({ min: 0, max: 50 }),
        sales: faker.number.int({ min: 0, max: 100 }),
        purchases: [],
        tags: [faker.word.noun(), faker.word.adjective()],
        featured: Math.random() > 0.7,
        drm: {
          enabled: true,
          watermark: true,
          tracking: true,
        },
        monetizationType: 'one-time',
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: new Date(),
      };
      items.push(item);
    }

    await Item.insertMany(items, { ordered: false });
    console.log(`✅ Created ${items.length} items\n`);

    // Add items to user libraries (purchases)
    console.log('📚 Seeding library purchases...');
    for (const user of users) {
      const itemsToAdd = items
        .slice(0, faker.number.int({ min: 0, max: 5 }))
        .map(item => ({
          itemId: item._id ? item._id.toString() : item._id,
          purchaseDate: faker.date.past(),
          price: item.price,
          status: 'purchased',
          accessLevel: 'full',
        }));

      user.library = itemsToAdd;
      await User.updateOne({ _id: user._id }, { library: itemsToAdd });
    }
    console.log('✅ Library purchases added\n');

    // Seed Conversations
    console.log('💬 Seeding conversations...');
    const conversations = [];
    
    for (let i = 0; i < 5; i++) {
      const user1 = users[faker.number.int({ min: 0, max: users.length - 1 })];
      const user2 = users[faker.number.int({ min: 0, max: users.length - 1 })];
      
      if (user1._id !== user2._id) {
        const conv = {
          participants: [user1._id, user2._id],
          lastMessage: {
            content: faker.lorem.sentence(),
            senderId: user1._id,
            timestamp: faker.date.recent(),
          },
          unreadCount: { [user2._id]: faker.number.int({ min: 0, max: 5 }) },
          createdAt: faker.date.past(),
          updatedAt: new Date(),
        };
        conversations.push(conv);
      }
    }

    const savedConversations = await Conversation.insertMany(conversations, { ordered: false });
    console.log(`✅ Created ${savedConversations.length} conversations\n`);

    // Seed Messages
    console.log('💌 Seeding messages...');
    const messages = [];
    
    for (const conv of savedConversations) {
      const messageCount = faker.number.int({ min: 5, max: 20 });
      for (let i = 0; i < messageCount; i++) {
        const sender = conv.participants[faker.number.int({ min: 0, max: 1 })];
        const message = {
          conversationId: conv._id.toString(),
          senderId: sender,
          content: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
          attachments: [],
          isRead: Math.random() > 0.3,
          readAt: faker.date.recent(),
          createdAt: faker.date.recent(),
        };
        messages.push(message);
      }
    }

    await Message.insertMany(messages, { ordered: false });
    console.log(`✅ Created ${messages.length} messages\n`);

    // Seed Transactions
    console.log('💳 Seeding transactions...');
    const transactions = [];
    const txTypes = ['purchase', 'earned', 'topup'];
    
    for (let i = 0; i < 30; i++) {
      const user = users[faker.number.int({ min: 0, max: users.length - 1 })];
      const txType = txTypes[faker.number.int({ min: 0, max: txTypes.length - 1 })];
      
      const tx = {
        userId: user._id,
        type: txType,
        amount: faker.number.int({ min: 10, max: 1000 }),
        itemId: txType === 'purchase' ? (items[faker.number.int({ min: 0, max: items.length - 1 })]._id ? items[faker.number.int({ min: 0, max: items.length - 1 })]._id.toString() : items[faker.number.int({ min: 0, max: items.length - 1 })]._id) : null,
        description: faker.lorem.sentence(),
        status: 'completed',
        createdAt: faker.date.past(),
      };
      transactions.push(tx);
    }

    await Transaction.insertMany(transactions, { ordered: false });
    console.log(`✅ Created ${transactions.length} transactions\n`);

    // Summary
    console.log('═════════════════════════════════════════');
    console.log('✅ Database Seeding Complete!');
    console.log('═════════════════════════════════════════\n');
    
    console.log('📊 Summary:');
    console.log(`   • Users: ${users.length}`);
    console.log(`   • Posts: ${posts.length}`);
    console.log(`   • Items: ${items.length}`);
    console.log(`   • Conversations: ${savedConversations.length}`);
    console.log(`   • Messages: ${messages.length}`);
    console.log(`   • Transactions: ${transactions.length}`);
    
    console.log('\n🔐 Test Accounts:');
    for (const account of TEST_ACCOUNTS) {
      console.log(`   Email: ${account.email}`);
    }
    
    console.log('\n💡 Usage Tips:');
    console.log('   • Use "--clear" flag to remove old data before seeding');
    console.log('   • All test accounts have "example.com" domain');
    console.log('   • Credits range from 100-10000');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
