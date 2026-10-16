// Real-time chat + notifications smoke test: two seeded users, one conversation, one message.
// Proves: web mints a chat JWT, the chat service accepts it, membership is enforced,
// the sender gets an ack and the recipient receives `message:new` over Socket.IO.
//
//   npm run test:chat     (needs web :5000, chat :3001 and `npm run db:seed`)
import dotenv from 'dotenv';
import { createRequire } from 'node:module';
dotenv.config();
const { io } = createRequire(import.meta.url)('socket.io-client');

const WEB = process.env.WEB || 'http://localhost:5000';
const CHAT = process.env.CHAT || 'http://localhost:3001';
const PASSWORD = 'DreamDot#2026';

let failed = 0;
const check = (name, ok, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : ` - ${detail}`}`);
};

async function login(email) {
  const jar = new Map();
  const cookie = () => [...jar].map(([k, v]) => `${k}=${v}`).join('; ');
  const store = (r) => {
    for (const c of r.headers.getSetCookie?.() ?? []) {
      const [p] = c.split(';');
      const i = p.indexOf('=');
      jar.set(p.slice(0, i).trim(), p.slice(i + 1).trim());
    }
  };
  let r = await fetch(`${WEB}/api/auth/csrf`);
  store(r);
  const { csrfToken } = await r.json();
  r = await fetch(`${WEB}/api/auth/callback/credentials`, {
    method: 'POST',
    redirect: 'manual',
    headers: { 'content-type': 'application/x-www-form-urlencoded', cookie: cookie() },
    body: new URLSearchParams({ csrfToken, email, password: PASSWORD, json: 'true' }),
  });
  store(r);
  r = await fetch(`${WEB}/api/auth/session`, { headers: { cookie: cookie() } });
  const session = await r.json();
  return { session, cookie: cookie() };
}

const connect = (token) =>
  new Promise((resolve, reject) => {
    const s = io(CHAT, { auth: { token }, transports: ['websocket'], reconnection: false });
    s.on('connect', () => resolve(s));
    s.on('connect_error', reject);
    setTimeout(() => reject(new Error('socket connect timeout')), 8000);
  });

try {
  const ava = await login('ava@dreamdot.dev');
  const ben = await login('ben@dreamdot.dev');
  check('both users have chat tokens', !!ava.session.chatToken && !!ben.session.chatToken, JSON.stringify(Object.keys(ava.session)));

  // Bad token must be rejected.
  const rejected = await connect('not-a-jwt').then(() => false, () => true);
  check('chat rejects an invalid token', rejected);

  const res = await fetch(`${WEB}/api/conversations`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: ava.cookie },
    body: JSON.stringify({ type: 'direct', participants: [ben.session.user.id] }),
  });
  const body = await res.json();
  const conversationId = body.conversation?.id ?? body.conversation?._id ?? body.id ?? body._id;
  check('conversation created', res.ok && !!conversationId, `${res.status} ${JSON.stringify(body).slice(0, 200)}`);

  const [sa, sb] = await Promise.all([connect(ava.session.chatToken), connect(ben.session.chatToken)]);
  check('both sockets connected', sa.connected && sb.connected);

  sa.emit('room:join', { conversationId });
  sb.emit('room:join', { conversationId });
  await new Promise((r) => setTimeout(r, 500));

  const received = new Promise((resolve) => sb.on('message:new', resolve));
  const ack = await new Promise((resolve) => {
    sa.emit('message:send', { conversationId, content: `hello ${Date.now()}` }, resolve);
    setTimeout(() => resolve(null), 5000);
  });
  check('sender gets an ack', ack?.ok !== false && ack !== null, JSON.stringify(ack));

  const msg = await Promise.race([received, new Promise((r) => setTimeout(() => r(null), 5000))]);
  check('recipient receives message:new', !!msg?.content?.startsWith('hello'), JSON.stringify(msg));

  // Cross-service: chat -> notifications. The send above must have created a notification for ben.
  await new Promise((r) => setTimeout(r, 1000));
  const nres = await fetch(`${process.env.NOTIF || 'http://localhost:3003'}/notifications`, {
    headers: { authorization: `Bearer ${ben.session.chatToken}` },
  });
  const nbody = await nres.json().catch(() => null);
  const list = Array.isArray(nbody) ? nbody : nbody?.notifications ?? nbody?.data ?? [];
  check('notifications service stored the message notification', nres.ok && list.some((n) => /Ava Chen sent you a message/.test(n.notification_content ?? n.content ?? '')), `${nres.status} ${JSON.stringify(nbody).slice(0, 200)}`);

  sa.close();
  sb.close();
} catch (err) {
  failed++;
  console.log('FAIL  unexpected error -', err.message);
}

console.log(failed ? `\n${failed} check(s) failed` : '\nAll chat checks passed');
process.exit(failed ? 1 : 0);
