// End-to-end smoke test against a running dev stack (web :5000, chat :3001,
// notifications :3003, web3 :3005). Exercises: signup + starting credits,
// post creation, item creation (free + paid), community create + join,
// purchases, transaction records, and dashboard/balance updates.

import dotenv from 'dotenv';
dotenv.config(); // SERVICE_SECRET etc. from the repo-root .env

const WEB = process.env.WEB || 'http://localhost:5000';
const NOTIF = process.env.NOTIF || 'http://localhost:3003';
const WEB3 = process.env.WEB3 || 'http://localhost:3005';

let pass = 0, fail = 0;
const results = [];
function check(name, cond, detail = '') {
  if (cond) { pass++; results.push(`  ✅ ${name}`); }
  else { fail++; results.push(`  ❌ ${name}${detail ? ` — ${detail}` : ''}`); }
}
function section(t) { results.push(`\n=== ${t} ===`); }

// --- tiny cookie jar ---
function makeClient() {
  const jar = new Map();
  return {
    jar,
    async fetch(url, opts = {}) {
      const headers = new Headers(opts.headers || {});
      const cookie = [...jar.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
      if (cookie) headers.set('cookie', cookie);
      const res = await fetch(url, { ...opts, headers, redirect: 'manual' });
      const sc = res.headers.getSetCookie?.() || [];
      for (const c of sc) {
        const [pair] = c.split(';');
        const idx = pair.indexOf('=');
        jar.set(pair.slice(0, idx).trim(), pair.slice(idx + 1).trim());
      }
      return res;
    },
  };
}

async function json(res) {
  const t = await res.text();
  try { return JSON.parse(t); } catch { return { __raw: t.slice(0, 300) }; }
}

async function signupAndLogin(client, { name, email, username, password }) {
  let res = await client.fetch(`${WEB}/api/auth/signup`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, email, username, password }),
  });
  const signup = await json(res);
  if (res.status !== 201) throw new Error(`signup ${email} failed: ${res.status} ${JSON.stringify(signup)}`);

  // NextAuth credentials login
  res = await client.fetch(`${WEB}/api/auth/csrf`);
  const { csrfToken } = await json(res);
  res = await client.fetch(`${WEB}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ csrfToken, email, password, json: 'true' }).toString(),
  });
  res = await client.fetch(`${WEB}/api/auth/session`);
  const session = await json(res);
  if (!session?.user?.email) throw new Error(`login ${email} failed: ${JSON.stringify(session)}`);
  return { userId: session.user.id, session };
}

const rnd = Math.random().toString(36).slice(2, 8);

(async () => {
  section('Service health');
  for (const [n, u] of [['web', `${WEB}/api/auth/csrf`], ['notifications', `${NOTIF}/health`], ['web3', `${WEB3}/health`]]) {
    try { const r = await fetch(u); check(`${n} /health reachable`, r.status < 500, `status ${r.status}`); }
    catch (e) { check(`${n} /health reachable`, false, e.message); }
  }

  // ---- Users ----
  section('Signup + starting credits');
  const buyer = makeClient();
  const seller = makeClient();
  const b = await signupAndLogin(buyer, { name: 'Buyer ' + rnd, email: `buyer_${rnd}@test.dev`, username: `buyer_${rnd}`, password: 'Passw0rd!123' });
  const s = await signupAndLogin(seller, { name: 'Seller ' + rnd, email: `seller_${rnd}@test.dev`, username: `seller_${rnd}`, password: 'Passw0rd!123' });
  check('buyer signed up + logged in', !!b.userId);
  check('seller signed up + logged in', !!s.userId);

  let res = await buyer.fetch(`${WEB}/api/balance`);
  let bal = await json(res);
  check('buyer starts with 100 credits', bal?.balance?.credits === 100, `got ${JSON.stringify(bal?.balance)}`);
  const startCredits = bal?.balance?.credits;

  // ---- Post ----
  section('Create a post');
  res = await buyer.fetch(`${WEB}/api/posts/create`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ content: `hello world from e2e ${rnd}`, visibility: true, category: 'general' }),
  });
  const post = await json(res);
  check('post created (2xx)', res.status >= 200 && res.status < 300, `status ${res.status} ${JSON.stringify(post).slice(0,200)}`);

  // ---- Items ----
  section('Create items (free + paid) with a price');
  const media = [{ url: 'https://ik.imagekit.io/demo/img/image1.jpeg', mimeType: 'image/jpeg', size: 1000, width: 400, height: 300 }];
  async function createItem(client, body) {
    const r = await client.fetch(`${WEB}/api/Items/create`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
    });
    return { status: r.status, body: await json(r) };
  }
  const freeItem = await createItem(seller, {
    title: `Free item ${rnd}`, description: 'a free thing', script: 'free body text here',
    category: 'writing', pricingModel: 'free', priceCredits: 0,
    media, thumbnailUrl: media[0].url,
  });
  check('free item created', freeItem.status >= 200 && freeItem.status < 300, `status ${freeItem.status} ${JSON.stringify(freeItem.body).slice(0,200)}`);
  const paidItem = await createItem(seller, {
    title: `Paid item ${rnd}`, description: 'a paid thing', script: 'paid body text here',
    category: 'writing', pricingModel: 'paid', priceCredits: 30,
    media, thumbnailUrl: media[0].url,
  });
  check('paid item created with price 30', paidItem.status >= 200 && paidItem.status < 300, `status ${paidItem.status} ${JSON.stringify(paidItem.body).slice(0,200)}`);

  const freeId = freeItem.body?.itemId;
  const paidId = paidItem.body?.itemId;
  results.push(`  (freeId=${freeId} paidId=${paidId})`);

  // ---- Community ----
  section('Community create + join');
  res = await seller.fetch(`${WEB}/api/communities`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: `Guild ${rnd}`, description: 'e2e guild', isPublic: true }),
  });
  const community = await json(res);
  check('community created by seller', res.status >= 200 && res.status < 300, `status ${res.status} ${JSON.stringify(community).slice(0,200)}`);
  const communityId = community?.community?.id || community?.id || community?.server?.server_id || community?.community?.server_id;
  results.push(`  (communityId=${communityId})`);

  res = await buyer.fetch(`${WEB}/api/communities/discover`);
  const disc = await json(res);
  check('community shows in discover for buyer', JSON.stringify(disc).includes(String(communityId ?? '###')), `discover=${JSON.stringify(disc).slice(0,200)}`);

  if (communityId) {
    res = await buyer.fetch(`${WEB}/api/communities/${communityId}/join`, { method: 'POST' });
    const joined = await json(res);
    check('buyer joined community', res.status >= 200 && res.status < 300, `status ${res.status} ${JSON.stringify(joined).slice(0,200)}`);
  } else {
    check('buyer joined community', false, 'no communityId parsed');
  }

  // ---- Purchases ----
  section('Purchase free + paid item');
  async function purchase(id) {
    const r = await buyer.fetch(`${WEB}/api/Items/${id}/purchase`, { method: 'POST' });
    return { status: r.status, body: await json(r) };
  }
  let freeBuy = { status: 0, body: {} }, paidBuy = { status: 0, body: {} };
  if (freeId) { freeBuy = await purchase(freeId); check('free item purchased', freeBuy.status >= 200 && freeBuy.status < 300, `status ${freeBuy.status} ${JSON.stringify(freeBuy.body).slice(0,200)}`); }
  else check('free item purchased', false, 'no freeId');
  if (paidId) { paidBuy = await purchase(paidId); check('paid item purchased', paidBuy.status >= 200 && paidBuy.status < 300, `status ${paidBuy.status} ${JSON.stringify(paidBuy.body).slice(0,200)}`); }
  else check('paid item purchased', false, 'no paidId');

  // ---- Balance / dashboard update ----
  section('Balance + dashboard update');
  res = await buyer.fetch(`${WEB}/api/balance`);
  bal = await json(res);
  check('buyer balance dropped by 30 (paid item)', bal?.balance?.credits === startCredits - 30, `start ${startCredits} -> ${bal?.balance?.credits}`);
  check('buyer totalSpent >= 30', Number(bal?.stats?.totalSpent) >= 30, `stats=${JSON.stringify(bal?.stats)}`);

  // ---- Top-up + review ----
  section('Credit top-up + review');
  res = await buyer.fetch(`${WEB}/api/balance/topup`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ amount: 250, review: { rating: 5, text: `great demo ${rnd}` } }),
  });
  const topup = await json(res);
  check('top-up succeeded', res.status >= 200 && res.status < 300, `status ${res.status} ${JSON.stringify(topup).slice(0,200)}`);
  check('top-up returns new balance', topup?.newBalance === (startCredits - 30 + 250), `newBalance=${topup?.newBalance}`);
  check('top-up recorded a review', !!topup?.reviewId, `reviewId=${topup?.reviewId}`);

  res = await buyer.fetch(`${WEB}/api/balance`);
  bal = await json(res);
  check('balance reflects top-up', bal?.balance?.credits === startCredits - 30 + 250, `credits=${bal?.balance?.credits}`);

  // ---- Transaction records ----
  section('Transaction records');
  res = await buyer.fetch(`${WEB}/api/transactions?limit=50`);
  const tx = await json(res);
  const list = tx?.transactions || [];
  check('transactions endpoint 200', res.status === 200, `status ${res.status}`);
  check('has a purchase transaction', list.some((t) => t.type === 'expense'), `types=${list.map(t=>t.type).join(',')}`);
  check('has a topup transaction', list.some((t) => t.type === 'topup'), `types=${list.map(t=>t.type).join(',')}`);
  check('transaction stats present', tx?.stats && typeof tx.stats.totalSpent === 'number', JSON.stringify(tx?.stats));

  // seller side
  res = await seller.fetch(`${WEB}/api/transactions?type=income&limit=50`);
  const sTx = await json(res);
  check('seller sees income transaction(s)', (sTx?.transactions || []).length >= 1, `count=${(sTx?.transactions||[]).length}`);

  // ---- web3 ledger ----
  section('On-chain ledger');
  try {
    const r = await fetch(`${WEB3}/ledger/entries?userId=${b.userId}`, { headers: { 'x-service-secret': process.env.SERVICE_SECRET || '' } });
    const led = await json(r);
    check('web3 ledger has entries for buyer', (led?.entries || []).length >= 1, `status ${r.status} count=${(led?.entries||[]).length}`);
    check('ledger entries carry a real chain tx hash (skipped if chain not configured)', (led?.entries||[]).every(e=>!!e.txHash) || !(await (await fetch(`${WEB3}/health`)).json()).configured, (led?.entries||[]).map(e=>e.txHash).join(','));
    check('ledger entries include a purchase + a topup', (led?.entries||[]).some(e=>e.kind==='purchase') && (led?.entries||[]).some(e=>e.kind==='topup'), (led?.entries||[]).map(e=>e.kind).join(','));
  } catch (e) { check('web3 ledger reachable', false, e.message); }

  // ---- summary ----
  console.log(results.join('\n'));
  console.log(`\n================  ${pass} passed, ${fail} failed  ================`);
  process.exit(fail === 0 ? 0 : 1);
})().catch((e) => {
  console.log(results.join('\n'));
  console.error('\nFATAL:', e.stack || e.message);
  process.exit(2);
});
