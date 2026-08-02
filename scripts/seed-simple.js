#!/usr/bin/env node
import { MongoClient } from 'mongodb';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

const { Pool } = pkg;

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dreamdot';
const CLEAR_MODE = process.argv.includes('--clear');

const pools = {
  user: new Pool({ connectionString: process.env.POSTGRESS_DB_USER || 'postgresql://postgres:postgres@localhost:5432/dreamdot_user?schema=user_d' }),
  social: new Pool({ connectionString: process.env.POSTGRESS_DB_SOCIAL || 'postgresql://postgres:postgres@localhost:5432/dreamdot_social?schema=social' }),
  items: new Pool({ connectionString: process.env.POSTGRESS_DB_ITEMS || 'postgresql://postgres:postgres@localhost:5432/dreamdot_item?schema=items_d' }),
  community: new Pool({ connectionString: process.env.POSTGRESS_DB_COMMUNITY || 'postgresql://postgres:postgres@localhost:5432/dreamdot_community?schema=community' }),
};

let mongoClient;

async function connectMongo() {
  mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();
  console.log('✅ Connected to MongoDB');
  return mongoClient.db('dreamdot');
}

async function seedPostgres() {
  console.log('\n📦 Seeding PostgreSQL...');
  
  const users = [];
  const userIds = [];
  
  // Create 10 users
  for (let i = 0; i < 10; i++) {
    const userId = uuidv4();
    const email = faker.internet.email();
    const password = `Password${i}123!`;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    userIds.push(userId);
    
    try {
      await pools.user.query(
        `INSERT INTO users (id, email, phone, password_hash, is_verified, is_active, user_type, initial_balance)
         VALUES ($1, $2, $3, $4, true, true, $5, $6)
         ON CONFLICT (email) DO NOTHING`,
        [userId, email, faker.phone.number(), hashedPassword, i === 0 ? 'creator' : 'user', 50000 + Math.random() * 50000]
      );
      
      // Create user profile
      await pools.user.query(
        `INSERT INTO user_profile (user_id, username, display_name, bio, avatar_url, website, country)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (user_id) DO NOTHING`,
        [userId, faker.internet.username(), faker.person.fullName(), faker.lorem.sentence(), faker.image.avatar(), faker.internet.url(), faker.location.country()]
      );
      
      // Create user analytics
      await pools.user.query(
        `INSERT INTO user_analytics (user_id, posts_count, likes_received, followers_count, following_count, activity_score)
         VALUES ($1, 0, 0, $2, $3, $4)
         ON CONFLICT (user_id) DO NOTHING`,
        [userId, Math.floor(Math.random() * 1000), Math.floor(Math.random() * 500), Math.random() * 100]
      );
      
      console.log(`  ✓ Created user ${i + 1}/10: ${email}`);
    } catch (err) {
      console.log(`  ⚠ User ${i + 1} already exists`);
    }
  }
  
  // Create 30 posts
  console.log('\n  Creating posts...');
  for (let i = 0; i < 30; i++) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const postId = uuidv4();
    
    try {
      await pools.social.query(
        `INSERT INTO posts_metadata (id, user_id, description, visibility)
         VALUES ($1, $2, $3, true)`,
        [postId, userId, faker.lorem.paragraphs(2)]
      );
      
      // Create analytics
      await pools.social.query(
        `INSERT INTO posts_analytics (post_id, views_count, likes_count, comments_count)
         VALUES ($1, $2, $3, $4)`,
        [postId, Math.floor(Math.random() * 1000), Math.floor(Math.random() * 200), Math.floor(Math.random() * 50)]
      );
    } catch (err) {
      // Ignore duplicates
    }
  }
  console.log(`  ✓ Created 30 posts`);
  
  // Create follow relationships
  console.log('  Creating follows...');
  for (let i = 0; i < 20; i++) {
    const followerId = userIds[Math.floor(Math.random() * userIds.length)];
    const followeeId = userIds[Math.floor(Math.random() * userIds.length)];
    
    if (followerId !== followeeId) {
      try {
        await pools.social.query(
          `INSERT INTO following (id, follower_id, followee_id)
           VALUES ($1, $2, $3)
           ON CONFLICT DO NOTHING`,
          [uuidv4(), followerId, followeeId]
        );
      } catch (err) {}
    }
  }
  console.log(`  ✓ Created follow relationships`);
  
  // Create 15 items
  console.log('  Creating items...');
  const categories = ['writing', 'illustration', 'audio', 'video', 'research', 'design', 'code', 'template'];
  
  for (let i = 0; i < 15; i++) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    
    try {
      await pools.items.query(
        `INSERT INTO items (item_id, user_id, title, description, category, price, availability, monetization_type)
         VALUES ($1, $2, $3, $4, $5, $6, true, 'one-time')`,
        [uuidv4(), userId, faker.commerce.productName(), faker.lorem.paragraphs(1), categories[Math.floor(Math.random() * categories.length)], Math.random() * 1000 + 10]
      );
    } catch (err) {}
  }
  console.log(`  ✓ Created 15 items`);
  
  // Create 3 servers with channels
  console.log('  Creating servers & channels...');
  for (let i = 0; i < 3; i++) {
    const ownerId = userIds[i % userIds.length];
    const serverId = uuidv4();
    
    try {
      await pools.community.query(
        `INSERT INTO servers (server_id, name, description, owner_id)
         VALUES ($1, $2, $3, $4)`,
        [serverId, faker.company.name() + ' Community', faker.company.catchPhrase(), ownerId]
      );
      
      // Create channels
      const channels = ['general', 'announcements', 'off-topic'];
      for (const channelName of channels) {
        await pools.community.query(
          `INSERT INTO channels (channel_id, server_id, name, type)
           VALUES ($1, $2, $3, 'text')`,
          [uuidv4(), serverId, channelName]
        );
      }
      
      // Add members
      for (let j = 0; j < 5; j++) {
        const memberId = userIds[j % userIds.length];
        try {
          await pools.community.query(
            `INSERT INTO members (member_id, server_id, user_id, role)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT DO NOTHING`,
            [uuidv4(), serverId, memberId, j === 0 ? 'admin' : 'member']
          );
        } catch (err) {}
      }
    } catch (err) {}
  }
  console.log(`  ✓ Created 3 servers with channels`);
  
  console.log('✅ PostgreSQL seeding complete');
  return userIds;
}

async function seedMongoDB(db, pgUserIds) {
  console.log('\n🍃 Seeding MongoDB...');
  
  // Create users
  const mongoUsers = [];
  for (let i = 0; i < pgUserIds.length; i++) {
    mongoUsers.push({
      _id: pgUserIds[i],
      email: faker.internet.email(),
      name: `User ${i + 1}`,
      avatar: faker.image.avatar(),
      bio: faker.lorem.sentence(),
      location: faker.location.city(),
      website: faker.internet.url(),
      credits: 1000 + Math.random() * 5000,
      totalEarned: Math.random() * 10000,
      totalSpent: Math.random() * 5000,
      followers: [],
      following: [],
      accountStatus: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  
  await db.collection('User').insertMany(mongoUsers, { ordered: false }).catch(() => {});
  console.log(`  ✓ Created ${mongoUsers.length} users`);
  
  // Create posts
  const posts = [];
  for (let i = 0; i < 20; i++) {
    posts.push({
      userId: pgUserIds[Math.floor(Math.random() * pgUserIds.length)],
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(2),
      media: [{ type: 'image', url: faker.image.url(), alt: 'Post media' }],
      visibility: true,
      likes: [],
      comments: [],
      shares: 0,
      tags: [faker.lorem.word(), faker.lorem.word()],
      engagementScore: Math.random() * 100,
      isSponsored: false,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  
  await db.collection('Post').insertMany(posts, { ordered: false }).catch(() => {});
  console.log(`  ✓ Created ${posts.length} posts`);
  
  // Create items
  const items = [];
  const itemCategories = ['writing', 'illustration', 'audio', 'video', 'research', 'design', 'code', 'template'];
  
  for (let i = 0; i < 12; i++) {
    items.push({
      userId: pgUserIds[Math.floor(Math.random() * pgUserIds.length)],
      title: faker.commerce.productName(),
      description: faker.lorem.paragraphs(1),
      category: itemCategories[Math.floor(Math.random() * itemCategories.length)],
      price: Math.floor(Math.random() * 1000 + 10),
      visibility: 'public',
      media: [{ url: faker.image.url(), mimeType: 'image/jpeg', size: Math.floor(Math.random() * 5000000), width: 1920, height: 1080 }],
      rating: Math.floor(Math.random() * 5),
      reviews: Math.floor(Math.random() * 50),
      sales: Math.floor(Math.random() * 100),
      purchases: [],
      tags: [faker.lorem.word(), faker.lorem.word()],
      featured: Math.random() > 0.7,
      isFeatured: Math.random() > 0.7,
      drm: { enabled: true, watermark: true, tracking: true },
      monetizationType: 'one-time',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  
  await db.collection('Item').insertMany(items, { ordered: false }).catch(() => {});
  console.log(`  ✓ Created ${items.length} items`);
  
  // Create conversations
  const conversations = [];
  for (let i = 0; i < 8; i++) {
    const user1 = pgUserIds[Math.floor(Math.random() * pgUserIds.length)];
    const user2 = pgUserIds[Math.floor(Math.random() * pgUserIds.length)];
    
    if (user1 !== user2) {
      conversations.push({
        participants: [user1, user2],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }
  
  const conversationResult = await db.collection('Conversation').insertMany(conversations, { ordered: false }).catch(() => ({ insertedIds: [] }));
  const conversationIds = Object.values(conversationResult.insertedIds || {});
  console.log(`  ✓ Created ${conversations.length} conversations`);
  
  // Create messages
  const messages = [];
  for (let i = 0; i < 50; i++) {
    if (conversationIds.length > 0) {
      const conversation = conversations[Math.floor(Math.random() * conversations.length)];
      const sender = conversation.participants[Math.floor(Math.random() * 2)];
      
      messages.push({
        conversationId: conversation._id,
        userId: sender,
        text: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
        readBy: [],
      });
    }
  }
  
  await db.collection('Message').insertMany(messages, { ordered: false }).catch(() => {});
  console.log(`  ✓ Created ${messages.length} messages`);
  
  // Create transactions
  const transactions = [];
  for (let i = 0; i < 25; i++) {
    const buyer = pgUserIds[Math.floor(Math.random() * pgUserIds.length)];
    const seller = pgUserIds[Math.floor(Math.random() * pgUserIds.length)];
    
    if (buyer !== seller) {
      transactions.push({
        buyerId: buyer,
        sellerId: seller,
        amount: Math.floor(Math.random() * 500 + 10),
        status: 'completed',
        type: 'purchase',
        description: faker.commerce.productName(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }
  
  await db.collection('Transaction').insertMany(transactions, { ordered: false }).catch(() => {});
  console.log(`  ✓ Created ${transactions.length} transactions`);
  
  console.log('✅ MongoDB seeding complete');
}

async function clearAllData() {
  console.log('\n🗑️  Clearing all data...');
  
  // Clear PostgreSQL
  for (const [name, pool] of Object.entries(pools)) {
    try {
      await pool.query('TRUNCATE TABLE (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) CASCADE;');
      console.log(`✅ Cleared ${name} DB`);
    } catch (err) {
      console.log(`⚠ Could not clear ${name} DB: ${err.message}`);
    }
  }
  
  // Clear MongoDB
  const db = await connectMongo();
  const collections = ['User', 'Post', 'Item', 'Conversation', 'Message', 'Transaction'];
  for (const col of collections) {
    await db.collection(col).deleteMany({});
  }
  console.log('✅ Cleared MongoDB');
}

async function main() {
  try {
    if (CLEAR_MODE) {
      await clearAllData();
      console.log('\n✅ All data cleared');
    } else {
      const db = await connectMongo();
      const userIds = await seedPostgres();
      await seedMongoDB(db, userIds);
      
      console.log('\n✅ Database seeding complete!');
      console.log('\n📊 Summary:');
      console.log('   - 10 test users created');
      console.log('   - 30 posts created');
      console.log('   - 15 items created');
      console.log('   - 20 follow relationships');
      console.log('   - 3 community servers');
      console.log('   - 8 conversations');
      console.log('   - 50 messages');
      console.log('   - 25 transactions');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    for (const pool of Object.values(pools)) {
      await pool.end();
    }
    if (mongoClient) await mongoClient.close();
  }
}

main();
