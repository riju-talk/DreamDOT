import { PrismaClient as UserPrisma } from '../apps/web/src/generated/user/index.js';
import { PrismaClient as SocialPrisma } from '../apps/web/src/generated/social/index.js';
import { PrismaClient as ItemsPrisma } from '../apps/web/src/generated/items/index.js';
import { PrismaClient as CommunityPrisma } from '../apps/web/src/generated/community/index.js';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { Decimal } from '@prisma/client/runtime/library';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dreamdot';
const CLEAR_MODE = process.argv.includes('--clear');

console.log('🌱 DreamDot Database Seeding...\n');

const userDb = new UserPrisma({
  datasources: {
    db: {
      url: process.env.POSTGRESS_DB_USER || 'postgresql://postgres:postgres@localhost:5432/dreamdot_user?schema=user_d',
    },
  },
});

const socialDb = new SocialPrisma({
  datasources: {
    db: {
      url: process.env.POSTGRESS_DB_SOCIAL || 'postgresql://postgres:postgres@localhost:5432/dreamdot_social?schema=social',
    },
  },
});

const itemsDb = new ItemsPrisma({
  datasources: {
    db: {
      url: process.env.POSTGRESS_DB_ITEMS || 'postgresql://postgres:postgres@localhost:5432/dreamdot_item?schema=items_d',
    },
  },
});

const communityDb = new CommunityPrisma({
  datasources: {
    db: {
      url: process.env.POSTGRESS_DB_COMMUNITY || 'postgresql://postgres:postgres@localhost:5432/dreamdot_community?schema=community',
    },
  },
});

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
    await userDb.users.upsert({
      where: { email: user.email },
      create: user,
      update: user,
    });

    await userDb.user_profile.upsert({
      where: { user_id: user.id },
      create: {
        user_id: user.id,
        username: faker.internet.username(),
        display_name: faker.person.fullName(),
        bio: faker.lorem.sentence(),
        avatar_url: faker.image.avatar(),
        website: faker.internet.url(),
        country: faker.location.country(),
        dob: faker.date.birthdate({ min: 18, max: 70, mode: 'age' }),
      },
      update: {},
    });

    await userDb.user_analytics.upsert({
      where: { user_id: user.id },
      create: {
        user_id: user.id,
        posts_count: 0,
        likes_received: 0,
        followers_count: Math.floor(Math.random() * 1000),
        following_count: Math.floor(Math.random() * 500),
        activity_score: new Decimal(Math.random() * 100),
      },
      update: {},
    });
  }

  console.log(`✅ Created ${users.length} users in User DB`);

  const userIds = users.map(u => u.id);

  for (let i = 0; i < 30; i++) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];

    const post = await socialDb.posts_metadata.create({
      data: {
        user_id: userId,
        description: faker.lorem.paragraphs(2),
        visibility: true,
      },
    });

    await socialDb.posts_analytics.create({
      data: {
        post_id: post.id,
        views_count: Math.floor(Math.random() * 1000),
        likes_count: Math.floor(Math.random() * 200),
        comments_count: Math.floor(Math.random() * 50),
      },
    });

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

    console.log(`  Created post ${i + 1}/30`);
  }

  console.log(`✅ Created 30 posts in Social DB`);

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

  console.log('✅ Created follow relationships');

  const categories = ['writing', 'illustration', 'audio', 'video', 'research', 'design', 'code', 'template'];

  for (let i = 0; i < 15; i++) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];

    await itemsDb.items.create({
      data: {
        user_id: userId,
        title: faker.commerce.productName(),
        description: faker.lorem.paragraphs(1),
        category: categories[Math.floor(Math.random() * categories.length)],
        price: new Decimal(Math.random() * 1000 + 10),
        availability: true,
        monetization_type: 'one-time',
      },
    });

    console.log(`  Created item ${i + 1}/15`);
  }

  console.log('✅ Created 15 items in Items DB');

  for (let i = 0; i < 3; i++) {
    const ownerId = userIds[i % userIds.length];

    const server = await communityDb.servers.create({
      data: {
        name: faker.company.name() + ' Community',
        description: faker.company.catchPhrase(),
        owner_id: ownerId,
      },
    });

    const channels = ['general', 'announcements', 'off-topic'];
    for (const channelName of channels) {
      await communityDb.channels.create({
        data: {
          server_id: server.server_id,
          name: channelName,
          type: 'text',
          topic: faker.lorem.sentence(),
        },
      });
    }

    for (let j = 0; j < 5; j++) {
      const memberId = userIds[j % userIds.length];
      await communityDb.members.create({
        data: {
          server_id: server.server_id,
          user_id: memberId,
          role: j === 0 ? 'admin' : 'member',
        },
      }).catch(() => {});
    }

    console.log(`  Created server ${i + 1}/3 with channels and members`);
  }

  console.log('✅ Created 3 servers with channels');
}

async function seedMongoDB(db: any) {
  console.log('\n🍃 Seeding MongoDB...');

  const pgUsers = await userDb.users.findMany({
    take: 10,
  });

  const users = [];
  for (let i = 0; i < pgUsers.length; i++) {
    const pgUser = pgUsers[i];

    const mongoUser = {
      _id: pgUser.id,
      email: pgUser.email,
      name: 'User ' + (i + 1),
      avatar: faker.image.avatar(),
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

  await db.collection('User').insertMany(users, { ordered: false }).catch(() => {});
  console.log(`✅ Created ${users.length} users in MongoDB`);

  const posts = [];
  for (let i = 0; i < 20; i++) {
    const user = users[Math.floor(Math.random() * users.length)];

    posts.push({
      userId: user._id,
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(2),
      media: [
        {
          type: 'image',
          url: faker.image.url(),
          alt: 'Post media',
        },
      ],
      visibility: true,
      createdAt: new Date(),
      updatedAt: new Date(),
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

  await db.collection('Post').insertMany(posts, { ordered: false }).catch(() => {});
  console.log(`✅ Created ${posts.length} posts in MongoDB`);

  const items = [];
  const itemCategories = ['writing', 'illustration', 'audio', 'video', 'research', 'design', 'code', 'template'];

  for (let i = 0; i < 12; i++) {
    const user = users[Math.floor(Math.random() * users.length)];

    items.push({
      userId: user._id,
      title: faker.commerce.productName(),
      description: faker.lorem.paragraphs(1),
      category: itemCategories[Math.floor(Math.random() * itemCategories.length)],
      price: Math.floor(Math.random() * 1000 + 10),
      visibility: 'public',
      media: [
        {
          url: faker.image.url(),
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
      monetizationType: 'one-time',
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await db.collection('Item').insertMany(items, { ordered: false }).catch(() => {});
  console.log(`✅ Created ${items.length} items in MongoDB`);

  const conversations = [];
  for (let i = 0; i < 8; i++) {
    const user1 = users[Math.floor(Math.random() * users.length)];
    const user2 = users[Math.floor(Math.random() * users.length)];

    if (user1._id !== user2._id) {
      conversations.push({
        participants: [user1._id, user2._id],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  await db.collection('Conversation').insertMany(conversations, { ordered: false }).catch(() => {});
  console.log(`✅ Created ${conversations.length} conversations in MongoDB`);

  const messages = [];
  for (let i = 0; i < 50; i++) {
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

  await db.collection('Message').insertMany(messages, { ordered: false }).catch(() => {});
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

  await db.collection('Transaction').insertMany(transactions, { ordered: false }).catch(() => {});
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
    await socialDb.posts_metadata.deleteMany({});
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
    await communityDb.messages.deleteMany({});
    await communityDb.members.deleteMany({});
    await communityDb.channels.deleteMany({});
    await communityDb.servers.deleteMany({});
    await communityDb.presence.deleteMany({});
    console.log('✅ Cleared Community DB');
  } catch (e) {
    console.log('Community DB already clean');
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
      console.log('   - 10 test users created');
      console.log('   - 30 posts created');
      console.log('   - 15 items created');
      console.log('   - 20 follow relationships');
      console.log('   - 3 community servers');
      console.log('   - 8 conversations');
      console.log('   - 50 messages');
      console.log('   - 25 transactions');
    }
  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await userDb.$disconnect();
    await socialDb.$disconnect();
    await itemsDb.$disconnect();
    await communityDb.$disconnect();
    if (mongoClient) await mongoClient.close();
  }
}

main();
