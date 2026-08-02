# DreamDot Database Setup Guide

## Overview

DreamDot uses a multi-database architecture with Docker Compose for local development:

- **MongoDB** - NoSQL database for users, posts, items, conversations, and messages
- **PostgreSQL** - Relational database for normalized data (5 separate databases)
- **Redis** - In-memory cache for sessions and real-time data

## Quick Start

### 1. Start All Databases

```bash
npm run db:up
```

This command:
- Starts MongoDB container (port 27017)
- Starts PostgreSQL container (port 5432)
- Starts Redis container (port 6379)
- Creates all necessary volumes

### 2. Install Dependencies

```bash
npm install
```

This installs the required packages including:
- `mongoose` - MongoDB ODM
- `@faker-js/faker` - Fake data generation
- `dotenv` - Environment variable management

### 3. Seed the Database with Fake Data

```bash
npm run db:seed:clear
```

This command:
- Clears any existing data
- Creates 5 test users with full profiles
- Generates 25 posts with engagement metrics
- Creates 15 digital items (marketplace)
- Sets up conversations and messages
- Populates transaction history
- Establishes follow relationships

## Database Structure

### MongoDB Collections

#### Users
```javascript
{
  _id: "user_demo_1",
  email: "alice@example.com",
  name: "Alice Creator",
  avatar: "https://...",
  credits: 1500,
  totalEarned: 3200,
  followers: ["user_demo_2", "user_demo_3"],
  following: ["user_demo_4"],
  library: [{ itemId: "...", purchaseDate: Date, price: 99 }],
  privacy: { profileVisibility: "public", ... },
  accountStatus: "active",
  createdAt: Date,
  updatedAt: Date
}
```

#### Posts
```javascript
{
  userId: "user_demo_1",
  title: "Amazing Design Tips",
  content: "Lorem ipsum...",
  media: [{ type: "image", url: "https://..." }],
  likes: ["user_demo_2", "user_demo_3"],
  comments: [{ userId: "user_demo_2", text: "Great post!" }],
  engagementScore: 245,
  category: "design",
  tags: ["design", "tips"],
  createdAt: Date
}
```

#### Items (Marketplace)
```javascript
{
  userId: "user_demo_1",
  title: "Professional Design Template",
  description: "High-quality design template...",
  category: "design",
  price: 99,
  visibility: "public",
  rating: 4.5,
  reviews: 12,
  sales: 45,
  media: [{ url: "https://...", mimeType: "image/jpeg" }],
  drm: { enabled: true, watermark: true },
  createdAt: Date
}
```

#### Conversations & Messages
```javascript
// Conversation
{
  participants: ["user_demo_1", "user_demo_2"],
  lastMessage: { content: "...", senderId: "user_demo_1", timestamp: Date },
  unreadCount: { "user_demo_2": 2 },
  createdAt: Date
}

// Message
{
  conversationId: "...",
  senderId: "user_demo_1",
  content: "Hey, how's the project going?",
  isRead: true,
  readAt: Date,
  createdAt: Date
}
```

#### Transactions
```javascript
{
  userId: "user_demo_1",
  type: "purchase" | "earned" | "topup" | "refund",
  amount: 99,
  itemId: "...",
  description: "Purchase of item",
  status: "completed",
  createdAt: Date
}
```

## Test Accounts

Five test accounts are created with the seed script:

| Email | Name | Credits | Role |
|-------|------|---------|------|
| alice@example.com | Alice Creator | 1200-10000 | Content Creator |
| bob@example.com | Bob Explorer | 1200-10000 | Explorer |
| charlie@example.com | Charlie Designer | 1200-10000 | Designer |
| diana@example.com | Diana Writer | 1200-10000 | Writer |
| eve@example.com | Eve Developer | 1200-10000 | Developer |

All accounts have random:
- Bios and locations
- Credit balances (100-10000)
- Follow relationships
- Purchased items (0-5 items per user)

## Available Commands

### Database Management

```bash
# Start all databases
npm run db:up

# Stop all databases
npm run db:down

# View database logs
npm run db:logs

# Check database status
npm run db:status

# Seed database with new data (keeps existing)
npm run db:seed

# Seed database and clear old data
npm run db:seed:clear

# Full reset (same as db:seed:clear)
npm run db:reset

# Clean up JSON test files
npm run db:cleanup
```

## Environment Variables

Key environment variables configured in `.env`:

```
# MongoDB
MONGODB_URI=mongodb://localhost:27017/dreamdot
MONGODB_DB_NAME=dreamdot

# PostgreSQL (5 databases)
POSTGRESS_DB_USER=postgresql://postgres:postgres@localhost:5432/dreamdot_user?schema=user_d
POSTGRESS_DB_SOCIAL=postgresql://postgres:postgres@localhost:5432/dreamdot_social?schema=social
POSTGRESS_DB_ITEMS=postgresql://postgres:postgres@localhost:5432/dreamdot_item?schema=items_d
POSTGRESS_DB_COMMUNITY=postgresql://postgres:postgres@localhost:5432/dreamdot_community?schema=community
POSTGRESS_DB_AUDIT=postgresql://postgres:postgres@localhost:5432/dreamdot_audit?schema=audit

# Redis
REDIS_URL=redis://localhost:6379

# Credentials
NEXTAUTH_SECRET=...
JWT_SECRET=...
```

## Docker Compose Configuration

The `docker-compose.yml` file includes:

### Services

1. **MongoDB** (Port 27017)
   - Image: mongo:7
   - Volume: mongodb_data
   - Health check: Every 10s

2. **PostgreSQL** (Port 5432)
   - Image: postgres:16-alpine
   - Databases: 5 (user, social, item, community, audit)
   - Volume: postgres_data
   - Init script: docker/postgres/init.sql

3. **Redis** (Port 6379)
   - Image: redis:7-alpine
   - Volume: redis_data
   - Persistence: AOF enabled

All services restart automatically unless stopped.

## Seeding Details

### Generated Data Volume

When running `npm run db:seed:clear`:

| Collection | Count | Notes |
|-----------|-------|-------|
| Users | 5 | Predefined test accounts |
| Posts | 25 | Random engagement, categories |
| Items | 15 | Various marketplace items |
| Conversations | 5 | Between random users |
| Messages | 50-100 | Distributed across conversations |
| Transactions | 30 | Various transaction types |

### Data Generation Features

- **Realistic Data**: Uses @faker-js/faker for natural text
- **Relationships**: Follow relationships, conversations
- **Engagement**: Likes, comments, shares with realistic numbers
- **Metadata**: Tags, categories, ratings
- **Timestamps**: Past dates for historical context
- **No Duplicates**: Uses database unique constraints

## Troubleshooting

### MongoDB Connection Failed

```bash
# Check if MongoDB is running
docker-compose ps

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### PostgreSQL Connection Failed

```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Ensure all databases were created
docker exec dreamdot-postgres psql -U postgres -l
```

### Seed Script Fails

```bash
# Install missing dependencies
npm install

# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Run seed with debug output
node --trace-uncaught scripts/seed-database.js --clear
```

### Port Already in Use

```bash
# Stop all containers and remove volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

## Best Practices

1. **Local Development**: Always use Docker Compose locally
2. **Seed Before Development**: Run `npm run db:seed:clear` when starting fresh
3. **Keep Test Accounts**: Don't delete the test accounts (user_demo_*)
4. **Backup Data**: Stop containers before system shutdowns
5. **Update Seeds**: Modify scripts/seed-database.js to add custom data
6. **Check Health**: Run `npm run db:status` to verify connections

## Next Steps

1. ✅ Start databases: `npm run db:up`
2. ✅ Install dependencies: `npm install`
3. ✅ Seed data: `npm run db:seed:clear`
4. ✅ Start development: `npm run dev`
5. ✅ View logs: `npm run db:logs`

## Architecture

```
┌─────────────────────────────────────────────┐
│           Next.js Web App                   │
│     (apps/web - localhost:5000)             │
└────────┬─────────────────┬──────────────────┘
         │                 │
    ┌────▼────┐      ┌─────▼────┐
    │ MongoDB │      │   Redis  │
    │ (27017) │      │  (6379)  │
    └─────────┘      └──────────┘
         │
    ┌────▼──────────────────────┐
    │   PostgreSQL (5 DBs)      │
    │ ├─ user_d (5432)          │
    │ ├─ social                 │
    │ ├─ items_d                │
    │ ├─ community              │
    │ └─ audit                  │
    └───────────────────────────┘
```

## Additional Resources

- [MongoDB Guide](https://docs.mongodb.com/)
- [PostgreSQL Guide](https://www.postgresql.org/docs/)
- [Faker.js Documentation](https://fakerjs.dev/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
