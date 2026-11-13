// Demo data migration: users (bcrypt-hashed passwords), posts, comments, likes.
//
// Run:  npm run db:seed        (after `docker compose up -d` + `prisma db push`)
//
// Design notes (interview talking points):
//  * IDEMPOTENT  - every id is a deterministic UUIDv5 of a stable key, and every write is
//                  an upsert, so running it twice is a no-op instead of a duplicate bomb.
//  * REAL HASHES - passwords go through the same bcrypt(10) the signup route uses, so the
//                  seeded accounts can actually log in. Nothing is stored in plaintext.
//  * HYBRID STORE- a post is split exactly like the live `POST /api/posts/create` route:
//                  Postgres holds metadata + relations, Mongo holds the body, linked by
//                  posts.sql_id == mongo.posts.sqlId. See docs/CAP_AND_CONSISTENCY.md.
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { v5 as uuidv5 } from "uuid";
import { MongoClient } from "mongodb";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(root, ".env") });
dotenv.config({ path: path.join(root, "apps/web/.env") });

// The generated Prisma clients are CommonJS and live inside apps/web.
const require = createRequire(path.join(root, "apps/web/package.json"));
const { PrismaClient: UserClient } = require("./src/lib/generated/user");
const { PrismaClient: SocialClient } = require("./src/lib/generated/social");

const prismaUser = new UserClient({ datasources: { db: { url: process.env.POSTGRESS_DB_USER } } });
const prismaSocial = new SocialClient({ datasources: { db: { url: process.env.POSTGRESS_DB_SOCIAL } } });

// Fixed namespace => the same key always yields the same UUID across machines/runs.
const NS = "6f1c1e3a-5b1e-4c0e-9d57-0d3a7c1d1f00";
const id = (key) => uuidv5(key, NS);

export const DEMO_PASSWORD = "DreamDot#2026";

const USERS = [
  { key: "ava", email: "ava@dreamdot.dev", username: "ava", name: "Ava Chen", bio: "Product designer. Ships small, iterates fast." },
  { key: "ben", email: "ben@dreamdot.dev", username: "ben", name: "Ben Okafor", bio: "Backend engineer. Postgres evangelist." },
  { key: "cleo", email: "cleo@dreamdot.dev", username: "cleo", name: "Cleo Martin", bio: "Data scientist turned indie hacker." },
  { key: "dev", email: "dev@dreamdot.dev", username: "dev", name: "Dev Patel", bio: "Mobile + web. Coffee-driven development." },
  { key: "eli", email: "eli@dreamdot.dev", username: "eli", name: "Eli Rossi", bio: "Learning in public, one commit at a time." },
];

const POSTS = [
  ["ava", "Just shipped my first template on DreamDot. Feedback welcome!"],
  ["ben", "Hot take: most apps need one Postgres and a queue, not twelve microservices."],
  ["cleo", "Notebook to production in a weekend. Here is what broke."],
  ["dev", "Offline-first is really a conflict-resolution problem in disguise."],
  ["eli", "Day 30 of learning system design. CAP theorem finally clicked."],
  ["ava", "Design tokens > hard-coded hex values. Always."],
  ["ben", "Idempotent seeds save lives. Upsert everything."],
  ["cleo", "Embeddings are just coordinates with good PR."],
  ["dev", "Reminder: every network call can fail. Plan for it."],
  ["eli", "Asked 'why Mongo AND Postgres?' in an interview. Here is my answer..."],
];

// [postIndex, authorKey, text, parentIndexInThisList | null]
const COMMENTS = [
  [0, "ben", "Looks great, love the clean layout.", null],
  [0, "cleo", "Agreed, the spacing is perfect.", 0],
  [1, "ava", "Counter-point: queues are a microservice in disguise :)", null],
  [1, "ben", "Fair! But one deployable beats twelve.", 2],
  [4, "ben", "CP vs AP is really 'what do you do during a partition?'", null],
  [4, "eli", "Exactly what clicked for me, thanks!", 4],
  [3, "ava", "CRDTs are worth a look for this.", null],
  [9, "dev", "Curious about the answer, share it!", null],
  [9, "cleo", "Polyglot persistence, each store for its access pattern.", 7],
  [6, "eli", "Stealing this for my seed script.", null],
];

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const now = new Date();

  // ---- Users + profiles (Postgres, user_d schema) --------------------------------
  for (const u of USERS) {
    const uid = id(`user:${u.key}`);
    await prismaUser.users.upsert({
      where: { id: uid },
      update: {},
      create: {
        id: uid,
        email: u.email,
        password_hash: passwordHash,
        is_verified: true,
        is_active: true,
        user_type: "user",
        initial_balance: 100, // demo credit economy: every account starts with 100
        user_profile: { create: { username: u.username, display_name: u.name, bio: u.bio } },
        user_analytics: { create: { posts_count: POSTS.filter((p) => p[0] === u.key).length } },
      },
    });
  }

  // ---- Mongo profile mirror (chat/notifications read display names from here) -----
  const mongo = new MongoClient(process.env.MONGODB_URI);
  await mongo.connect();
  const mongoDb = mongo.db(process.env.MONGODB_DB_NAME || "dreamdot");
  for (const u of USERS) {
    const uid = id(`user:${u.key}`);
    await mongoDb.collection("users").updateOne({ _id: uid }, { $set: { email: u.email, name: u.name, bio: u.bio } }, { upsert: true });
  }

  // ---- Posts: Postgres metadata + Mongo body, linked by sql_id --------------------
  const mongoPosts = mongoDb.collection("posts");

  const postIds = [];
  for (const [i, [authorKey, content]] of POSTS.entries()) {
    const pid = id(`post:${i}`);
    const userId = id(`user:${authorKey}`);
    const createdAt = new Date(now.getTime() - (POSTS.length - i) * 3_600_000); // 1h apart
    postIds.push(pid);

    await prismaSocial.posts.upsert({
      where: { id: pid },
      update: {},
      create: { id: pid, sql_id: pid, user_id: userId, content, visibility: true, created_at: createdAt, updated_at: createdAt },
    });
    await mongoPosts.updateOne(
      { sqlId: pid },
      {
        $setOnInsert: {
          userId, sqlId: pid, content, media: [], visibility: true, createdAt, updatedAt: createdAt,
          likes: [], comments: [], shares: 0, saves: [], category: "general", tags: [],
          engagementScore: 0, isSponsored: false,
        },
      },
      { upsert: true },
    );
  }

  // ---- Comments (threaded) --------------------------------------------------------
  const commentCounts = new Map();
  for (const [i, [postIdx, authorKey, content, parentIdx]] of COMMENTS.entries()) {
    const cid = id(`comment:${i}`);
    await prismaSocial.comments.upsert({
      where: { comment_id: cid },
      update: {},
      create: {
        comment_id: cid,
        post_id: postIds[postIdx],
        user_id: id(`user:${authorKey}`),
        content,
        parent_comment_id: parentIdx === null ? null : id(`comment:${parentIdx}`),
      },
    });
    commentCounts.set(postIdx, (commentCounts.get(postIdx) ?? 0) + 1);
  }

  // ---- Likes + denormalised analytics (counts derived from the rows above) --------
  const likeCounts = new Map();
  for (const [i] of POSTS.entries()) {
    for (const u of USERS) {
      if (u.key === POSTS[i][0] || (i + u.key.length) % 2) continue; // deterministic "some people liked it"
      // `likes` has no natural unique key (serial PK), so check-then-insert keeps it idempotent.
      const like = { user_id: id(`user:${u.key}`), post_id: postIds[i] };
      if (!(await prismaSocial.likes.findFirst({ where: like }))) await prismaSocial.likes.create({ data: like });
      likeCounts.set(i, (likeCounts.get(i) ?? 0) + 1);
    }
  }
  for (const [i, pid] of postIds.entries()) {
    const data = { comments_count: commentCounts.get(i) ?? 0, likes_count: likeCounts.get(i) ?? 0 };
    await prismaSocial.posts_analytics.upsert({
      where: { post_id: pid },
      update: data,
      create: { post_id: pid, views_count: 10 * (i + 1), ...data },
    });
  }

  await mongo.close();
  console.log(`Seeded ${USERS.length} users, ${POSTS.length} posts, ${COMMENTS.length} comments.`);
  console.log(`Login with any <user>@dreamdot.dev / ${DEMO_PASSWORD}`);
}

main()
  .catch((err) => {
    console.error("seed failed:", err);
    process.exitCode = 1;
  })
  .finally(() => Promise.all([prismaUser.$disconnect(), prismaSocial.$disconnect()]));
