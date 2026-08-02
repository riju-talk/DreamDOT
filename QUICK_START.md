# DreamDot Quick Start Guide

## 🚀 Get Started in 2 Minutes

### 1. Start Databases
```bash
npm run db:up
```
✅ MongoDB, PostgreSQL, Redis all running

### 2. Start Development Server
```bash
npm run dev
```
✅ Web app running at http://localhost:5000

### 3. (Optional) Start Chat Server
```bash
npm run chat:dev
```
✅ Chat server running at http://localhost:3001

---

## 🔐 Test Accounts

Use any of these to test:

| Email | Password | Role |
|-------|----------|------|
| alice@example.com | (OAuth) | Creator |
| bob@example.com | (OAuth) | Explorer |
| charlie@example.com | (OAuth) | Designer |
| diana@example.com | (OAuth) | Writer |
| eve@example.com | (OAuth) | Developer |

**Credits:** Each account has 100-10,000 credits

---

## 📱 Available Pages

| URL | Purpose | Status |
|-----|---------|--------|
| / | Landing | ✅ Ready |
| /feed | Social feed | 🟡 Phase 1 |
| /marketplace | Digital items | 🟡 Phase 1 |
| /library | Purchased items | 🟡 Phase 1 |
| /wallet | Credit balance | 🟡 Phase 1 |
| /create | Creator studio | 🟡 Phase 2 |
| /ad-studio | Ad campaigns | 🟡 Phase 3 |
| /messages | Chat | 🟡 Phase 4 |
| /communities | Communities | 🟡 Phase 4 |
| /profile/[id] | User profile | 🟡 Phase 5 |
| /settings | Settings | 🟡 Phase 5 |

---

## 🗄️ Database Status

### Check All Connections
```bash
npm run db:status
```

### View Logs
```bash
docker-compose logs -f mongodb
docker-compose logs -f postgres
docker-compose logs -f redis
```

### Stop Everything
```bash
npm run db:down
```

---

## 🌱 Manage Seed Data

### Add New Data
```bash
npm run db:seed
```

### Clear & Reseed
```bash
npm run db:seed:clear
```

### Reset Completely
```bash
npm run db:reset
```

---

## 🛠️ Common Tasks

### Clear MongoDB Collection
```bash
docker exec dreamdot-mongodb mongosh
> use dreamdot
> db.posts.deleteMany({})
```

### Reset PostgreSQL
```bash
docker exec dreamdot-postgres psql -U postgres -c "DROP DATABASE dreamdot_user;"
docker-compose restart postgres
```

### View Database Stats
```bash
# Users
docker exec dreamdot-mongodb mongosh --eval "db.users.find().count()"

# Posts
docker exec dreamdot-mongodb mongosh --eval "db.posts.find().count()"

# Items
docker exec dreamdot-mongodb mongosh --eval "db.items.find().count()"
```

---

## 🔗 Important URLs

| Service | URL | Port |
|---------|-----|------|
| Web App | http://localhost:5000 | 5000 |
| Chat | http://localhost:3001 | 3001 |
| MongoDB | mongodb://localhost:27017 | 27017 |
| PostgreSQL | postgresql://localhost:5432 | 5432 |
| Redis | redis://localhost:6379 | 6379 |

---

## 📊 Data Overview

**Total Records:**
- 5 Users
- 25 Posts
- 15 Items
- 4 Conversations
- 54 Messages
- 30 Transactions

**Features Ready to Test:**
- ✅ User profiles & credits
- ✅ Social posts with engagement
- ✅ Marketplace items
- ✅ Messaging system
- ✅ Transaction history
- ✅ Follow relationships

---

## ⚙️ Configuration

### Environment Variables
```
MONGODB_URI=mongodb://localhost:27017/dreamdot
NEXTAUTH_SECRET=... (see .env)
JWT_SECRET=... (see .env)
```

### Docker Services
```
mongo:7 → Port 27017
postgres:16-alpine → Port 5432
redis:7-alpine → Port 6379
```

---

## 🐛 Troubleshooting

### "Connection refused"
```bash
docker-compose ps  # Check status
docker-compose up -d  # Start
```

### "Port already in use"
```bash
docker-compose down -v  # Stop & remove volumes
docker-compose up -d    # Fresh start
```

### Seed script fails
```bash
npm install  # Reinstall dependencies
npm run db:seed:clear  # Try again
```

---

## 📚 Full Documentation

- **DATABASE_SETUP.md** - Complete setup guide
- **EXECUTION_GUIDE.md** - Implementation phases
- **.kiro/DATABASE_INITIALIZATION.md** - Init status
- **PHASE_*_PLAN.md** - Detailed plans (6 phases)

---

## 🎯 What's Next?

1. ✅ Database initialized
2. ✅ Seed data loaded
3. ✅ Test accounts ready
4. 🔄 **Start development** → Read EXECUTION_GUIDE.md
5. 🔄 **Implement Phase 1** → Read PHASE_1_PLAN.md

---

## 💡 Pro Tips

- Use `npm run dev:all` to start web + chat
- Use test accounts for manual testing
- Run `npm run db:reset` before implementing new features
- Check `.kiro/EXECUTION_GUIDE.md` for phase breakdown
- All data in MongoDB and PostgreSQL (local Docker)

---

**Status:** ✅ Ready to develop!

Next: Open `EXECUTION_GUIDE.md` or start with `npm run dev`
