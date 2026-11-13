// GraphQL smoke test against a running web app (default http://localhost:5000).
// Requires the demo seed (`npm run db:seed`). Exercises: anonymous reads, auth guard,
// login with a seeded bcrypt-hashed account, createPost, addComment, topUp, and the
// service-to-service path (x-service-secret).
//
//   npm run test:graphql
import dotenv from 'dotenv';
dotenv.config();

const WEB = process.env.WEB || 'http://localhost:5000';
const URL = `${WEB}/api/graphql`;
const PASSWORD = 'DreamDot#2026';

let failed = 0;
const check = (name, ok, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : ` - ${detail}`}`);
};

const jar = new Map();
const cookies = () => [...jar].map(([k, v]) => `${k}=${v}`).join('; ');
const store = (res) => {
  for (const c of res.headers.getSetCookie?.() ?? []) {
    const [pair] = c.split(';');
    const i = pair.indexOf('=');
    jar.set(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
  }
};

async function gql(query, variables, headers = {}) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: cookies(), ...headers },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

async function login(email) {
  let res = await fetch(`${WEB}/api/auth/csrf`);
  store(res);
  const { csrfToken } = await res.json();
  res = await fetch(`${WEB}/api/auth/callback/credentials`, {
    method: 'POST',
    redirect: 'manual',
    headers: { 'content-type': 'application/x-www-form-urlencoded', cookie: cookies() },
    body: new URLSearchParams({ csrfToken, email, password: PASSWORD, json: 'true' }),
  });
  store(res);
}

// 1. Anonymous
let r = await gql('{ health me { id } }');
check('anonymous health + me=null', r.data?.health === 'ok' && r.data.me === null, JSON.stringify(r));

r = await gql('{ feed(limit: 5) { total hasMore posts { id content likeCount commentCount author { username } comments { content author { username } } } } }');
check('anonymous feed returns seeded posts', r.data?.feed?.posts?.length > 0 && r.data.feed.posts[0].author?.username, JSON.stringify(r).slice(0, 300));

r = await gql('{ balance { credits } }');
check('balance rejected when signed out', r.errors?.[0]?.extensions?.code === 'UNAUTHENTICATED', JSON.stringify(r));

r = await gql('mutation { createPost(content: "x") { id } }');
check('createPost rejected when signed out', r.errors?.[0]?.extensions?.code === 'UNAUTHENTICATED', JSON.stringify(r));

// 2. Authenticated as a seeded user (proves the migration's password hashes really work)
await login('ava@dreamdot.dev');
r = await gql('{ me { username displayName } balance { credits } }');
check('seeded user can log in', r.data?.me?.username === 'ava', JSON.stringify(r));
const before = r.data?.balance?.credits;

r = await gql('mutation($c: String!) { createPost(content: $c) { id content author { username } } }', { c: `smoke ${Date.now()}` });
const postId = r.data?.createPost?.id;
check('createPost', !!postId && r.data.createPost.author?.username === 'ava', JSON.stringify(r));

r = await gql('mutation($p: ID!) { addComment(postId: $p, content: "nice") { id content author { username } } }', { p: postId });
check('addComment', r.data?.addComment?.content === 'nice', JSON.stringify(r));

r = await gql('{ post(id: "' + postId + '") { commentCount comments { content } } }');
check('commentCount reflects the new comment', r.data?.post?.commentCount === 1 && r.data.post.comments.length === 1, JSON.stringify(r));

r = await gql('mutation { topUp(amount: 25) { newBalance } }');
check('topUp adds credits', r.data?.topUp?.newBalance === before + 25, JSON.stringify(r));

r = await gql('mutation { topUp(amount: -5) { newBalance } }');
check('topUp validates amount', r.errors?.[0]?.extensions?.code === 'INVALID_AMOUNT', JSON.stringify(r));

// 3. Service-to-service: no cookie, shared secret + acting user id
if (process.env.SERVICE_SECRET) {
  const meId = (await gql('{ me { id } }')).data.me.id;
  jar.clear();
  r = await gql('{ me { username } }', undefined, { 'x-service-secret': process.env.SERVICE_SECRET, 'x-user-id': meId });
  check('service caller authenticates via x-service-secret', r.data?.me?.username === 'ava', JSON.stringify(r));
  r = await gql('{ me { username } }', undefined, { 'x-service-secret': 'wrong', 'x-user-id': meId });
  check('wrong service secret is anonymous', r.data?.me === null, JSON.stringify(r));
}

console.log(failed ? `\n${failed} check(s) failed` : '\nAll GraphQL checks passed');
process.exit(failed ? 1 : 0);
