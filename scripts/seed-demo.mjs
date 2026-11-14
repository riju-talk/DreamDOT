// Demo data migration: a believable creator economy.
//
//   13 creators with avatars/banners/bios, ~40 image posts, threaded comments, likes, saves,
//   a follow graph, 25 marketplace items, purchases paid from wallet balances, reviews,
//   favourites, wallet top-ups and 6 communities.
//
// Run:
//   npm run db:seed                                   -> local docker stack (root .env)
//   node scripts/seed-demo.mjs --check                -> validate the data, touch no database
//   node scripts/seed-demo.mjs --env=.env.web --yes-remote
//                                                     -> a remote database (Neon/Atlas). The
//                                                        flag is required so it never happens by accident.
//
// Design notes:
//  * IDEMPOTENT  - every id is a deterministic UUIDv5 of a stable key and every write is an
//                  upsert (or delete-then-insert scoped to seed rows), so re-running converges.
//  * REAL HASHES - passwords use the same bcrypt(10) as the signup route; seeded accounts log in.
//  * HYBRID STORE- like the live routes: Postgres holds metadata/relations, Mongo holds bodies,
//                  linked by sql_id == mongo.sqlId. See docs/CAP_AND_CONSISTENCY.md.
//  * WALLETS ADD UP - balance = base + top-ups - purchases, computed from the transactions seeded,
//                  so a user's wallet always matches their transaction history.
//  * NON-DESTRUCTIVE - only touches rows it owns (deterministic ids) and the demo/creator accounts;
//                  an existing account with the same email is updated, never duplicated.
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { v5 as uuidv5 } from "uuid";
import { MongoClient } from "mongodb";
import {
  DEMO_PASSWORD, USERS, POSTS, COMMENTS, ITEMS, PURCHASES, TOPUPS, REVIEWS, COMMUNITIES, FOLLOWS,
  avatar, banner, pic,
} from "./seed-data.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => args.find((a) => a.startsWith(`${name}=`))?.split("=").slice(1).join("=");

// Fixed namespace => the same key always yields the same UUID across machines/runs.
const NS = "6f1c1e3a-5b1e-4c0e-9d57-0d3a7c1d1f00";
const id = (key) => uuidv5(key, NS);
const hash = (s) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const hoursAgo = (h) => new Date(Date.now() - h * 3_600_000);

// ---------------------------------------------------------------------------------------
// 1. Validate the data (runs before any database is touched)
// ---------------------------------------------------------------------------------------
function validate() {
  const problems = [];
  const userKeys = new Set(USERS.map((u) => u.key));
  const itemByTitle = new Map(ITEMS.map((i) => [i[1], i]));
  const bought = new Set();

  if (new Set(USERS.map((u) => u.email)).size !== USERS.length) problems.push("duplicate user email");
  if (itemByTitle.size !== ITEMS.length) problems.push("duplicate item title");
  for (const p of POSTS) if (!userKeys.has(p[0])) problems.push(`post author unknown: ${p[0]}`);
  for (const i of ITEMS) if (!userKeys.has(i[0])) problems.push(`item creator unknown: ${i[0]}`);

  COMMENTS.forEach(([postIdx, author, , parent], i) => {
    if (!POSTS[postIdx]) problems.push(`comment ${i}: post ${postIdx} does not exist`);
    if (!userKeys.has(author)) problems.push(`comment ${i}: unknown author ${author}`);
    if (parent !== null) {
      if (!(parent < i)) problems.push(`comment ${i}: parent ${parent} must come earlier`);
      else if (COMMENTS[parent][0] !== postIdx) problems.push(`comment ${i}: parent ${parent} is on a different post`);
    }
  });

  const spent = new Map(), topped = new Map();
  for (const [buyer, title] of PURCHASES) {
    const item = itemByTitle.get(title);
    if (!item) { problems.push(`purchase of unknown item "${title}"`); continue; }
    if (!userKeys.has(buyer)) problems.push(`purchase by unknown user ${buyer}`);
    if (item[0] === buyer) problems.push(`${buyer} buys their own item "${title}"`);
    const k = `${buyer}|${title}`;
    if (bought.has(k)) problems.push(`duplicate purchase ${k}`);
    bought.add(k);
    spent.set(buyer, (spent.get(buyer) ?? 0) + item[3]);
  }
  for (const [u, credits] of TOPUPS) topped.set(u, (topped.get(u) ?? 0) + credits);
  for (const u of USERS) {
    const bal = u.base + (topped.get(u.key) ?? 0) - (spent.get(u.key) ?? 0);
    if (bal < 0) problems.push(`${u.key} would have a negative balance (${bal})`);
  }
  for (const [reviewer, title] of REVIEWS) if (!bought.has(`${reviewer}|${title}`)) problems.push(`review by ${reviewer} on un-purchased "${title}"`);
  for (const [follower, followees] of FOLLOWS) {
    if (!userKeys.has(follower)) problems.push(`follower unknown ${follower}`);
    for (const f of followees) { if (!userKeys.has(f)) problems.push(`followee unknown ${f}`); if (f === follower) problems.push(`${follower} follows self`); }
  }
  for (const c of COMMUNITIES) for (const m of [c[3], ...c[5]]) if (!userKeys.has(m)) problems.push(`community ${c[0]}: unknown member ${m}`);
  return { problems, spent, topped };
}

const { problems, spent, topped } = validate();
if (problems.length) {
  console.error("Seed data is inconsistent:\n - " + problems.join("\n - "));
  process.exit(1);
}
if (flag("--check")) {
  console.log(`OK: ${USERS.length} users, ${POSTS.length} posts, ${COMMENTS.length} comments, ${ITEMS.length} items, ${PURCHASES.length} purchases, ${REVIEWS.length} reviews, ${COMMUNITIES.length} communities.`);
  for (const u of USERS) console.log(`  ${u.key.padEnd(6)} wallet ${String(u.base + (topped.get(u.key) ?? 0) - (spent.get(u.key) ?? 0)).padStart(5)} credits`);
  process.exit(0);
}

// ---------------------------------------------------------------------------------------
// 2. Pick the target database and refuse remote ones unless explicitly confirmed
// ---------------------------------------------------------------------------------------
const envFile = opt("--env");
if (envFile) {
  dotenv.config({ path: path.resolve(root, envFile) });
} else {
  dotenv.config({ path: path.join(root, ".env") });
  dotenv.config({ path: path.join(root, "apps/web/.env") });
}
const hostOf = (url) => { try { return new URL(url.replace(/^mongodb\+srv:/, "mongodb:")).hostname; } catch { return "unknown"; } };
const targets = [process.env.POSTGRESS_DB_USER, process.env.POSTGRESS_DB_SOCIAL, process.env.POSTGRESS_DB_ITEMS, process.env.POSTGRESS_DB_COMMUNITY, process.env.MONGODB_URI];
if (targets.some((t) => !t)) { console.error("Missing POSTGRESS_DB_* / MONGODB_URI in the selected env file."); process.exit(1); }
const hosts = [...new Set(targets.map(hostOf))];
const isLocal = hosts.every((h) => ["localhost", "127.0.0.1", "::1", "host.docker.internal"].includes(h));
console.log(`Seeding target: ${hosts.join(", ")} (${isLocal ? "local" : "REMOTE"})`);
if (!isLocal && !flag("--yes-remote")) {
  console.error("Refusing to write to a remote database without --yes-remote.");
  process.exit(1);
}

// The generated Prisma clients are CommonJS and live inside apps/web.
const require = createRequire(path.join(root, "apps/web/package.json"));
const client = (name, envVar) => {
  const { PrismaClient } = require(`./src/lib/generated/${name}`);
  return new PrismaClient({ datasources: { db: { url: process.env[envVar] } } });
};
const prismaUser = client("user", "POSTGRESS_DB_USER");
const prismaSocial = client("social", "POSTGRESS_DB_SOCIAL");
const prismaItems = client("items", "POSTGRESS_DB_ITEMS");
const prismaCommunity = client("community", "POSTGRESS_DB_COMMUNITY");

const jsonMime = (u) => (u.endsWith(".mp4") ? "video/mp4" : "image/jpeg");

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const userId = {}; // key -> uuid (existing account wins, so we never duplicate by email)

  // ---- Users + profiles --------------------------------------------------------------
  for (const u of USERS) {
    const existing = await prismaUser.users.findUnique({ where: { email: u.email }, select: { id: true } });
    const uid = existing?.id ?? id(`user:${u.key}`);
    userId[u.key] = uid;
    const finalBalance = u.base + (topped.get(u.key) ?? 0) - (spent.get(u.key) ?? 0);
    const profile = { username: u.username, display_name: u.name, bio: u.bio, avatar_url: avatar(u.key), banner_url: banner(u.key), country: u.country };

    if (!existing) {
      await prismaUser.users.create({
        data: {
          id: uid, email: u.email, password_hash: passwordHash, is_verified: true, is_active: true, user_type: "user",
          initial_balance: finalBalance,
          user_profile: { create: profile },
          user_analytics: { create: {} },
        },
      });
    } else {
      await prismaUser.users.update({ where: { id: uid }, data: { is_verified: true, is_active: true, initial_balance: finalBalance } });
      await prismaUser.user_profile.upsert({
        where: { user_id: uid },
        update: { display_name: u.name, bio: u.bio, avatar_url: avatar(u.key), banner_url: banner(u.key), country: u.country },
        create: { user_id: uid, ...profile },
      });
      await prismaUser.user_analytics.upsert({ where: { user_id: uid }, update: {}, create: { user_id: uid } });
    }
    await prismaUser.user_about.upsert({
      where: { user_id: uid },
      update: { about: u.bio, skills: u.skills },
      create: { user_id: uid, about: u.bio, skills: u.skills },
    });
  }

  // ---- Mongo profile mirror (chat/notifications read display names from here) ---------
  const mongo = new MongoClient(process.env.MONGODB_URI);
  await mongo.connect();
  const mongoDb = mongo.db(process.env.MONGODB_DB_NAME || "dreamdot");
  for (const u of USERS) {
    await mongoDb.collection("users").updateOne(
      { _id: userId[u.key] },
      { $set: { email: u.email, name: u.name, bio: u.bio, avatar: avatar(u.key) } },
      { upsert: true },
    );
  }

  // ---- Retire the original thin seed posts (ids post:0..9) --------------------------
  const legacyPostIds = Array.from({ length: 10 }, (_, i) => id(`post:${i}`));
  await prismaSocial.posts.deleteMany({ where: { id: { in: legacyPostIds } } }); // cascades comments/likes
  await mongoDb.collection("posts").deleteMany({ sqlId: { $in: legacyPostIds } });

  // ---- Posts: Postgres metadata + Mongo body, linked by sql_id -----------------------
  const mongoPosts = mongoDb.collection("posts");
  const postIds = POSTS.map((_, i) => id(`p2:${i}`));
  const likeRows = [], saveRows = [];
  const likesByPost = POSTS.map(() => []), savesByPost = POSTS.map(() => []);

  POSTS.forEach(([author, , , , , , ], i) => {
    const popularity = 30 + (hash(`pop:${i}`) % 45); // each post has its own reach, 30-74%
    for (const u of USERS) {
      if (u.key === author) continue;
      if (hash(`like:${i}:${u.key}`) % 100 < popularity) likesByPost[i].push(u.key);
      if (hash(`save:${i}:${u.key}`) % 100 < 10) savesByPost[i].push(u.key);
    }
    likesByPost[i].forEach((k) => likeRows.push({ user_id: userId[k], post_id: postIds[i], liked_at: new Date(hoursAgo(POSTS[i][5]).getTime() + 600_000 * (1 + (hash(`lt:${i}:${k}`) % 40))) }));
    savesByPost[i].forEach((k) => saveRows.push({ save_id: id(`save:${i}:${k}`), user_id: userId[k], post_id: postIds[i], saved_at: hoursAgo(Math.max(1, POSTS[i][5] - 2)) }));
  });

  const commentCounts = POSTS.map(() => 0);
  COMMENTS.forEach(([postIdx]) => { commentCounts[postIdx] += 1; });

  for (const [i, [author, category, content, imageSeed, tags, hrs, title]] of POSTS.entries()) {
    const pid = postIds[i];
    const createdAt = hoursAgo(hrs);
    await prismaSocial.posts.upsert({
      where: { id: pid },
      update: { content, created_at: createdAt, updated_at: createdAt },
      create: { id: pid, sql_id: pid, user_id: userId[author], content, visibility: true, created_at: createdAt, updated_at: createdAt },
    });
    const likes = likesByPost[i].map((k) => userId[k]);
    await mongoPosts.updateOne(
      { sqlId: pid },
      {
        $set: {
          userId: userId[author], sqlId: pid, title: title ?? "", content, visibility: true, category, tags,
          media: imageSeed ? [{ type: "image", url: pic(imageSeed), alt: title ?? content.slice(0, 80) }] : [],
          likes, saves: savesByPost[i].map((k) => userId[k]), shares: hash(`sh:${i}`) % 9, createdAt, updatedAt: createdAt,
          engagementScore: likes.length * 2 + commentCounts[i] * 3, isSponsored: false, isFeatured: i < 3,
        },
        $setOnInsert: { comments: [] },
      },
      { upsert: true },
    );
  }

  // likes / saves have no natural unique key, so replace the seed posts' rows wholesale.
  await prismaSocial.likes.deleteMany({ where: { post_id: { in: postIds } } });
  await prismaSocial.likes.createMany({ data: likeRows });
  await prismaSocial.saves.deleteMany({ where: { post_id: { in: postIds } } });
  await prismaSocial.saves.createMany({ data: saveRows });

  // ---- Comments (threaded) -----------------------------------------------------------
  for (const [i, [postIdx, author, content, parent]] of COMMENTS.entries()) {
    const created = new Date(hoursAgo(POSTS[postIdx][5]).getTime() + 900_000 * (i + 1));
    await prismaSocial.comments.upsert({
      where: { comment_id: id(`c2:${i}`) },
      update: { content, created_at: created },
      create: {
        comment_id: id(`c2:${i}`), post_id: postIds[postIdx], user_id: userId[author], content, created_at: created,
        parent_comment_id: parent === null ? null : id(`c2:${parent}`),
      },
    });
  }

  // ---- Post analytics ----------------------------------------------------------------
  for (const [i, pid] of postIds.entries()) {
    const data = { likes_count: likesByPost[i].length, comments_count: commentCounts[i] };
    await prismaSocial.posts_analytics.upsert({
      where: { post_id: pid },
      update: { ...data, views_count: 120 + likesByPost[i].length * 37 + (hash(`v:${i}`) % 300) },
      create: { post_id: pid, ...data, views_count: 120 + likesByPost[i].length * 37 + (hash(`v:${i}`) % 300) },
    });
  }

  // ---- Follow graph ------------------------------------------------------------------
  const seedUserIds = Object.values(userId);
  await prismaSocial.following.deleteMany({ where: { follower_id: { in: seedUserIds }, followee_id: { in: seedUserIds } } });
  const followRows = FOLLOWS.flatMap(([a, list]) => list.map((b) => ({ id: id(`follow:${a}:${b}`), follower_id: userId[a], followee_id: userId[b], followed_at: hoursAgo(200 + (hash(`f:${a}:${b}`) % 400)) })));
  await prismaSocial.following.createMany({ data: followRows });

  // ---- Marketplace: Postgres metadata + Mongo item, linked by sql_id -----------------
  const mongoItems = mongoDb.collection("items");
  const itemId = Object.fromEntries(ITEMS.map((i) => [i[1], id(`item:${i[1]}`)]));
  const purchasesByItem = new Map();
  PURCHASES.forEach(([buyer, title, hrs]) => {
    const list = purchasesByItem.get(title) ?? [];
    list.push({ buyer, hrs });
    purchasesByItem.set(title, list);
  });
  const reviewCount = new Map();
  REVIEWS.forEach(([, title]) => reviewCount.set(title, (reviewCount.get(title) ?? 0) + 1));

  for (const [n, [creator, title, category, price, kind, description, tags, imageSeed, rating, hrs]] of ITEMS.entries()) {
    const iid = itemId[title];
    const createdAt = hoursAgo(hrs + 24);
    await prismaItems.items.upsert({
      where: { item_id: iid },
      update: { title, description, category, price, monetization_type: kind, availability: true, visibility: "public" },
      create: { item_id: iid, sql_id: iid, user_id: userId[creator], title, description, category, price, monetization_type: kind, availability: true, visibility: "public", created_at: createdAt },
    });
    const thumb = pic(imageSeed, 1000, 750);
    const sales = purchasesByItem.get(title) ?? [];
    await mongoItems.updateOne(
      { sqlId: iid },
      {
        $set: {
          userId: userId[creator], sqlId: iid, title, description, category, price, visibility: "public",
          media: [{ url: thumb, mimeType: jsonMime(thumb), size: 0 }],
          rating, reviews: reviewCount.get(title) ?? 0, sales: sales.length,
          purchases: sales.map((s) => ({ buyerId: userId[s.buyer], purchaseDate: hoursAgo(s.hrs), transactionId: id(`tx:purchase:${s.buyer}:${title}`) })),
          tags, featured: rating >= 4.8, isFeatured: rating >= 4.8,
          drm: { enabled: true, watermark: true, tracking: true },
          monetizationType: kind === "paid" ? "one-time" : "free",
          metadata: { script: description, bundleItemIds: [], thumbnailUrl: thumb, originalCategory: category, subscriptionBillingCycle: null, subscriptionMonthlyCredits: 0, subscriptionAnnualCredits: 0 },
          createdAt, updatedAt: createdAt,
        },
      },
      { upsert: true },
    );
  }

  // ---- Wallet: top-ups, purchases (+ ownership), reviews, favourites -----------------
  for (const [i, [u, credits, hrs]] of TOPUPS.entries()) {
    const txId = id(`tx:topup:${i}`);
    const data = { buyer_id: userId[u], item_id: null, kind: "topup", amount: credits, payment_status: "completed", transaction_date: hoursAgo(hrs) };
    await prismaItems.transactions.upsert({ where: { transaction_id: txId }, update: data, create: { transaction_id: txId, ...data } });
  }
  for (const [buyer, title, hrs] of PURCHASES) {
    const item = ITEMS.find((i) => i[1] === title);
    const txId = id(`tx:purchase:${buyer}:${title}`);
    const data = { buyer_id: userId[buyer], item_id: itemId[title], kind: "purchase", amount: item[3], payment_status: "completed", transaction_date: hoursAgo(hrs) };
    await prismaItems.transactions.upsert({ where: { transaction_id: txId }, update: data, create: { transaction_id: txId, ...data } });
    const ownId = id(`own:${buyer}:${title}`);
    const own = { item_id: itemId[title], creator_id: userId[item[0]], customer_id: userId[buyer] };
    await prismaItems.item_ownership.upsert({ where: { ownership_id: ownId }, update: own, create: { ownership_id: ownId, ...own, created_at: hoursAgo(hrs) } });
  }
  for (const [reviewer, title, rating, text] of REVIEWS) {
    const rid = id(`rev:${reviewer}:${title}`);
    const data = { user_id: userId[reviewer], item_id: itemId[title], review_type: "item", rating, review_text: text };
    await prismaItems.reviews.upsert({ where: { review_id: rid }, update: data, create: { review_id: rid, ...data, created_at: hoursAgo(1 + (hash(`rv:${reviewer}:${title}`) % 20)) } });
  }
  // Favourites: buyers favourite ~half of what they bought; the demo account also saves a few wishlist items.
  const favs = PURCHASES.filter(([b, t]) => hash(`fav:${b}:${t}`) % 2 === 0).map(([b, t]) => [b, t]);
  for (const t of ["Character Pack Vol. 1", "Rain Room Sample Pack", "Cinematic LUT Bundle", "Low-Poly Island Scene"]) favs.push(["demo", t]);
  for (const [u, title] of favs) {
    const fid = id(`fav:${u}:${title}`);
    const data = { user_id: userId[u], item_id: itemId[title] };
    await prismaItems.favorites.upsert({ where: { favorite_id: fid }, update: data, create: { favorite_id: fid, ...data } });
  }

  // ---- Communities -------------------------------------------------------------------
  for (const [key, name, description, owner, channels, members] of COMMUNITIES) {
    const sid = id(`srv:${key}`);
    await prismaCommunity.servers.upsert({
      where: { server_id: sid },
      update: { name, description, is_public: true },
      create: { server_id: sid, name, description, owner_id: userId[owner], is_public: true },
    });
    for (const [pos, ch] of channels.entries()) {
      const cid = id(`chn:${key}:${ch}`);
      await prismaCommunity.channels.upsert({
        where: { channel_id: cid },
        update: { name: ch, position: pos },
        create: { channel_id: cid, server_id: sid, name: ch, type: "text", position: pos, topic: `#${ch} in ${name}` },
      });
    }
    for (const m of [owner, ...members]) {
      const mid = id(`mem:${key}:${m}`);
      await prismaCommunity.members.upsert({
        where: { member_id: mid },
        update: { role: m === owner ? "owner" : "member" },
        create: { member_id: mid, server_id: sid, user_id: userId[m], role: m === owner ? "owner" : "member" },
      });
    }
  }

  // ---- Denormalised user analytics (derived from the rows above) ----------------------
  for (const u of USERS) {
    const uid = userId[u.key];
    const myPosts = POSTS.map((p, i) => [p, i]).filter(([p]) => p[0] === u.key).map(([, i]) => i);
    const data = {
      posts_count: myPosts.length,
      likes_received: myPosts.reduce((s, i) => s + likesByPost[i].length, 0),
      followers_count: followRows.filter((f) => f.followee_id === uid).length,
      following_count: followRows.filter((f) => f.follower_id === uid).length,
    };
    await prismaUser.user_analytics.upsert({ where: { user_id: uid }, update: data, create: { user_id: uid, ...data } });
  }

  await mongo.close();
  console.log(`Seeded ${USERS.length} users, ${POSTS.length} posts, ${COMMENTS.length} comments, ${likeRows.length} likes, ${followRows.length} follows,`);
  console.log(`       ${ITEMS.length} market items, ${PURCHASES.length} purchases, ${REVIEWS.length} reviews, ${COMMUNITIES.length} communities.`);
  console.log(`Login with any <name>@dreamdot.dev (e.g. demo@dreamdot.dev) / ${DEMO_PASSWORD}`);
}

main()
  .catch((err) => {
    console.error("seed failed:", err);
    process.exitCode = 1;
  })
  .finally(() => Promise.all([prismaUser.$disconnect(), prismaSocial.$disconnect(), prismaItems.$disconnect(), prismaCommunity.$disconnect()]));
