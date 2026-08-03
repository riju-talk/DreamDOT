import { prismaUser } from '../apps/web/src/lib/prisma/user.js';
import { prismaSocial } from '../apps/web/src/lib/prisma/social.js';
import { prismaItems } from '../apps/web/src/lib/prisma/items.js';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dreamdot';
const CLEAR_MODE = process.argv.includes('--clear');

// Hardcoded image URLs for consistency
const AVATAR_URLS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1537368191519-689ad163238b?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
];

const BANNER_URLS = [
  'https://images.unsplash.com/photo-1579546929662-711aa33e6b2f?w=1200&h=300&fit=crop',
  'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=300&fit=crop',
  'https://images.unsplash.com/photo-1557672172-298e090d0f80?w=1200&h=300&fit=crop',
  'https://images.unsplash.com/photo-1551078869-a0f32e23eb20?w=1200&h=300&fit=crop',
  'https://images.unsplash.com/photo-1559888481-d4c1fd290e65?w=1200&h=300&fit=crop',
];

const ITEM_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1573634760626-e2d8e6c3e16a?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=500&fit=crop',
];

console.log('🌱 DreamDot Database Seeding...\n');

const userDb = prismaUser;
const socialDb = prismaSocial;
const itemsDb = prismaItems;

let mongoClient: MongoClient;

async function connectMongo() {
  mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();
  console.log('✅ Connected to MongoDB');
  return mongoClient.db('dreamdot');
}

async function seedPostgres() {
  console.log('\n📦 Seeding PostgreSQL Databases...');

  const users = [];
  const passwords: Record<string, string> = {};

  for (let i = 0; i < 10; i++) {
    const email = faker.internet.email();
    const password = `Password${i}123!`;
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
      id: userId,
      email,
      phone: faker.phone.number(),
      password_hash: hashedPassword,
      is_verified: true,
      is_active: true,
      user_type: i === 0 ? 'creator' : 'user',
      initial_balance: 50000 + Math.random() * 50000,
    });

    passwords[email] = password;

    console.log(`  Created user ${i + 1}: ${email} (password: ${password})`);
  }

  for (const user of users) {
    await userDb.users.create({
      data: user,
    }).catch(() => {});

    await userDb.user_profile.create({
      data: {
        user_id: user.id,
        username: `user_${user.id.slice(0, 8)}`,
        display_name: faker.person.fullName(),
        bio: faker.lorem.sentence(),
        avatar_url: AVATAR_URLS[Math.floor(Math.random() * AVATAR_URLS.length)],
        banner_url: BANNER_URLS[Math.floor(Math.random() * BANNER_URLS.length)],
        website: faker.internet.url(),
        country: faker.location.country(),
        dob: faker.date.birthdate({ min: 18, max: 70, mode: 'age' }),
        social_links: JSON.stringify({
          allowDM: true,
          dmNotifications: true,
          twitter: faker.internet.url(),
          instagram: faker.internet.url(),
        }),
      },
    }).catch(() => {});

    await userDb.user_analytics.create({
      data: {
        user_id: user.id,
        posts_count: 0,
        likes_received: 0,
        followers_count: Math.floor(Math.random() * 1000),
        following_count: Math.floor(Math.random() * 500),
        activity_score: Math.random() * 100,
      },
    }).catch(() => {});
  }

  console.log(`✅ Created ${users.length} users in User DB`);

  const userIds = users.map(u => u.id);

  // Seed Posts
  for (let i = 0; i < 30; i++) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const postId = uuidv4();

    const post = await socialDb.posts.create({
      data: {
        id: postId,
        user_id: userId,
        sql_id: postId,
        content: faker.lorem.paragraphs(1),
        visibility: true,
      },
    }).catch((e) => {
      console.log(`  ⚠️  Post creation error (${i + 1}/30): ${e.message.slice(0, 50)}`);
      return null;
    });

    if (post) {
      await socialDb.posts_analytics.create({
        data: {
          post_id: post.id,
          views_count: Math.floor(Math.random() * 1000),
          likes_count: Math.floor(Math.random() * 200),
          comments_count: Math.floor(Math.random() * 50),
        },
      }).catch(() => {});

      // Add random likes
      const likeCount = Math.floor(Math.random() * 10);
      for (let j = 0; j < likeCount; j++) {
        const likerUserId = userIds[Math.floor(Math.random() * userIds.length)];
        if (likerUserId !== userId) {
          await socialDb.likes.create({
            data: {
              user_id: likerUserId,
              post_id: post.id,
            },
          }).catch(() => {});
        }
      }
    }

    console.log(`  Created post ${i + 1}/30`);
  }

  console.log(`✅ Created 30 posts in Social DB`);

  // Seed Follows
  for (let i = 0; i < 20; i++) {
    const followerId = userIds[Math.floor(Math.random() * userIds.length)];
    const followeeId = userIds[Math.floor(Math.random() * userIds.length)];

    if (followerId !== followeeId) {
      await socialDb.following.create({
        data: {
          follower_id: followerId,
          followee_id: followeeId,
        },
      }).catch(() => {});
    }
  }

  console.log('✅ Created 20 follow relationships');

  // Seed Items
  const categories = ['writing', 'illustration', 'audio', 'video', 'research', 'design', 'code', 'template'];

  for (let i = 0; i < 15; i++) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const itemId = uuidv4();

    await itemsDb.items.create({
      data: {
        item_id: itemId,
        user_id: userId,
        sql_id: itemId,
        title: faker.commerce.productName(),
        description: faker.lorem.paragraphs(1),
        category: categories[Math.floor(Math.random() * categories.length)],
        price: Math.random() * 1000 + 10,
        monetization_type: 'one-time',
        visibility: 'public',
        availability: true,
      },
    }).catch(() => {});

    console.log(`  Created item ${i + 1}/15`);
  }

  console.log('✅ Created 15 items in Items DB');
}

async function seedMongoDB(db: any) {
  console.log('\n🍃 Seeding MongoDB...');

  // Get created users from PostgreSQL
  const pgUsers = await userDb.users.findMany({
    take: 10,
  });

  // Get created posts from PostgreSQL
  const pgPosts = await socialDb.posts.findMany({
    take: 30,
  });

  // Get created items from PostgreSQL
  const pgItems = await itemsDb.items.findMany({
    take: 15,
  });

  const users = [];
  for (let i = 0; i < pgUsers.length; i++) {
    const pgUser = pgUsers[i];

    const mongoUser = {
      _id: pgUser.id,
      email: pgUser.email,
      name: pgUser.id.slice(0, 8),
      avatar: AVATAR_URLS[i % AVATAR_URLS.length],
      bio: faker.lorem.sentence(),
      location: faker.location.city(),
      website: faker.internet.url(),
      socialLinks: [faker.internet.url(), faker.internet.url()],
      credits: 1000 + Math.random() * 5000,
      totalEarned: Math.random() * 10000,
      totalSpent: Math.random() * 5000,
      library: [],
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        allowMessages: true,
        allowNotifications: true,
        showOnlineStatus: true,
        showActivityStatus: true,
        allowDM: true,
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        frequency: 'realtime',
        quietHoursStart: '22:00',
        quietHoursEnd: '08:00',
        types: {
          newFollowers: true,
          itemPurchases: true,
          comments: true,
          messages: true,
          liveStreams: true,
        },
      },
      followers: [],
      following: [],
      blockedUsers: [],
      connectedServices: {
        metaAccounts: [],
        web3Wallets: [],
      },
      accountStatus: 'active',
      lastLoginAt: new Date(),
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(mongoUser);
  }

  await db.collection('users').insertMany(users, { ordered: false }).catch(() => {});
  console.log(`✅ Created ${users.length} users in MongoDB`);

  // Create posts linked to PostgreSQL posts
  const posts = [];
  for (const pgPost of pgPosts) {
    posts.push({
      sqlId: pgPost.sql_id,
      userId: pgPost.user_id,
      content: pgPost.content || faker.lorem.paragraphs(2),
      media: [
        {
          type: 'image',
          url: ITEM_IMAGE_URLS[Math.floor(Math.random() * ITEM_IMAGE_URLS.length)],
          alt: 'Post media',
        },
      ],
      visibility: pgPost.visibility,
      createdAt: pgPost.created_at,
      updatedAt: pgPost.updated_at,
      likes: [],
      comments: [],
      shares: 0,
      saves: [],
      category: 'general',
      tags: [faker.lorem.word(), faker.lorem.word()],
      engagementScore: Math.random() * 100,
      isSponsored: false,
      isFeatured: false,
    });
  }

  await db.collection('posts').insertMany(posts, { ordered: false }).catch(() => {});
  console.log(`✅ Created ${posts.length} posts in MongoDB`);

  // Create items linked to PostgreSQL items
  const items = [];
  for (const pgItem of pgItems) {
    items.push({
      sqlId: pgItem.sql_id,
      userId: pgItem.user_id,
      title: pgItem.title,
      description: pgItem.description || faker.lorem.paragraphs(1),
      category: pgItem.category,
      price: Number(pgItem.price) || Math.floor(Math.random() * 1000 + 10),
      visibility: pgItem.visibility || 'public',
      media: [
        {
          url: ITEM_IMAGE_URLS[Math.floor(Math.random() * ITEM_IMAGE_URLS.length)],
          mimeType: 'image/jpeg',
          size: Math.floor(Math.random() * 5000000),
          width: 1920,
          height: 1080,
        },
      ],
      rating: Math.floor(Math.random() * 5),
      reviews: Math.floor(Math.random() * 50),
      sales: Math.floor(Math.random() * 100),
      purchases: [],
      tags: [faker.lorem.word(), faker.lorem.word()],
      featured: Math.random() > 0.7,
      isFeatured: Math.random() > 0.7,
      drm: {
        enabled: true,
        watermark: true,
        tracking: true,
      },
      monetizationType: pgItem.monetization_type || 'one-time',
      metadata: {},
      createdAt: pgItem.created_at,
      updatedAt: new Date(),
    });
  }

  await db.collection('items').insertMany(items, { ordered: false }).catch(() => {});
  console.log(`✅ Created ${items.length} items in MongoDB`);

  const conversations = [];
  for (let i = 0; i < 8; i++) {
    const user1 = users[Math.floor(Math.random() * users.length)];
    const user2 = users[Math.floor(Math.random() * users.length)];

    if (user1._id !== user2._id) {
      conversations.push({
        _id: uuidv4(),
        participants: [user1._id, user2._id],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  const insertedConvos = await db.collection('conversations').insertMany(conversations, { ordered: false }).catch(() => ({ insertedIds: {} }));
  console.log(`✅ Created ${conversations.length} conversations in MongoDB`);

  const conversationIds = Object.values(insertedConvos.insertedIds || {}).map((id: any) => id.toString());
  
  const messages = [];
  for (let i = 0; i < 50; i++) {
    if (conversationIds.length === 0) break;
    const conversationId = conversationIds[Math.floor(Math.random() * conversationIds.length)];
    const user = users[Math.floor(Math.random() * users.length)];

    messages.push({
      conversationId: conversationId,
      userId: user._id,
      text: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date(),
      readBy: [],
    });
  }

  await db.collection('messages').insertMany(messages, { ordered: false }).catch(() => {});
  console.log(`✅ Created ${messages.length} messages in MongoDB`);

  const transactions = [];
  for (let i = 0; i < 25; i++) {
    const buyer = users[Math.floor(Math.random() * users.length)];
    const seller = users[Math.floor(Math.random() * users.length)];

    if (buyer._id !== seller._id) {
      transactions.push({
        buyerId: buyer._id,
        sellerId: seller._id,
        amount: Math.floor(Math.random() * 500 + 10),
        status: 'completed',
        type: 'purchase',
        description: faker.commerce.productName(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  await db.collection('transactions').insertMany(transactions, { ordered: false }).catch(() => {});
  console.log(`✅ Created ${transactions.length} transactions in MongoDB`);
}

async function clearAllData() {
  console.log('\n🗑️  Clearing all data...');

  try {
    await socialDb.likes.deleteMany({});
    await socialDb.saves.deleteMany({});
    await socialDb.shares.deleteMany({});
    await socialDb.comments.deleteMany({});
    await socialDb.posts_analytics.deleteMany({});
    await socialDb.posts.deleteMany({});
    await socialDb.following.deleteMany({});
    await socialDb.blocking.deleteMany({});
    await socialDb.reported_content.deleteMany({});
    await socialDb.notifications.deleteMany({});
    console.log('✅ Cleared Social DB');
  } catch (e) {
    console.log('Social DB already clean');
  }

  try {
    await itemsDb.transactions.deleteMany({});
    await itemsDb.reviews.deleteMany({});
    await itemsDb.favorites.deleteMany({});
    await itemsDb.monetization.deleteMany({});
    await itemsDb.items.deleteMany({});
    console.log('✅ Cleared Items DB');
  } catch (e) {
    console.log('Items DB already clean');
  }

  try {
    await userDb.user_sessions.deleteMany({});
    await userDb.user_security.deleteMany({});
    await userDb.user_profile.deleteMany({});
    await userDb.user_certificates.deleteMany({});
    await userDb.user_blocklist.deleteMany({});
    await userDb.user_audit_logs.deleteMany({});
    await userDb.user_analytics.deleteMany({});
    await userDb.user_about.deleteMany({});
    await userDb.users.deleteMany({});
    console.log('✅ Cleared User DB');
  } catch (e) {
    console.log('User DB already clean');
  }

  const db = await connectMongo();
  await db.collection('User').deleteMany({});
  await db.collection('Post').deleteMany({});
  await db.collection('Item').deleteMany({});
  await db.collection('Conversation').deleteMany({});
  await db.collection('Message').deleteMany({});
  await db.collection('Transaction').deleteMany({});
  console.log('✅ Cleared MongoDB');
}

async function main() {
  try {
    if (CLEAR_MODE) {
      await clearAllData();
      console.log('\n✅ All data cleared');
    } else {
      const db = await connectMongo();

      await seedPostgres();
      await seedMongoDB(db);

      console.log('\n✅ Database seeding complete!');
      console.log('\n📊 Summary:');
      console.log('   - 10 test users created with profiles');
      console.log('   - 30 posts created with engagement data');
      console.log('   - 20 follow relationships');
      console.log('   - 15 digital items created');
      console.log('   - 8 conversations');
      console.log('   - 50 messages');
      console.log('   - 25 transactions');
      console.log('\n💡 All users have DM enabled in their profiles');
    }
  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await userDb.$disconnect();
    await socialDb.$disconnect();
    await itemsDb.$disconnect();
    if (mongoClient) await mongoClient.close();
  }
}

main();
