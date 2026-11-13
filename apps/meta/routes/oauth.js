const express = require('express');
const router = express.Router();

const GRAPH_VERSION = 'v19.0';
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

/**
 * GET /oauth/authorize-url
 * Returns the URL the web app should redirect the creator to. Real, callable
 * the moment META_APP_ID + META_OAUTH_REDIRECT_URI are set — nothing else needed
 * for this specific endpoint.
 */
router.get('/authorize-url', (req, res) => {
  const redirectUri = process.env.META_OAUTH_REDIRECT_URI;
  if (!redirectUri) {
    return res.status(503).json({ error: 'META_OAUTH_REDIRECT_URI is not set' });
  }

  const scopes = ['instagram_basic', 'pages_show_list', 'ads_management', 'pages_read_engagement'].join(',');
  const url = new URL(`https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth`);
  url.searchParams.set('client_id', process.env.META_APP_ID);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', scopes);
  url.searchParams.set('response_type', 'code');

  res.json({ url: url.toString() });
});

/**
 * GET /oauth/callback
 * Meta redirects here with ?code=... after the creator approves. Exchanges
 * the code for a long-lived access token via the Graph API.
 *
 * NOT WIRED TO STORAGE YET: there is no MetaIntegration table in Postgres
 * today (see docs/DATA_SCHEMA.md §7 — explicitly out of schema scope until
 * this service starts). Adding that table is a real migration against the
 * shared `items` or a new `meta` Postgres schema and needs a decision, not
 * a guess — don't add it silently. Once decided, persist the token pair
 * here instead of just returning them.
 */
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  try {
    const tokenUrl = new URL(`${GRAPH_BASE}/oauth/access_token`);
    tokenUrl.searchParams.set('client_id', process.env.META_APP_ID);
    tokenUrl.searchParams.set('client_secret', process.env.META_APP_SECRET);
    tokenUrl.searchParams.set('redirect_uri', process.env.META_OAUTH_REDIRECT_URI);
    tokenUrl.searchParams.set('code', code);

    const tokenResponse = await fetch(tokenUrl.toString());
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('[meta] Token exchange failed:', tokenData);
      return res.status(502).json({ error: 'Meta token exchange failed', detail: tokenData });
    }

    // TODO: persist { accessToken: tokenData.access_token, expiresAt } once
    // a MetaIntegration table exists. For now, this proves the OAuth flow
    // works end-to-end without inventing storage nobody has reviewed.
    res.json({ received: true, expiresIn: tokenData.expires_in });
  } catch (error) {
    console.error('[meta] OAuth callback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
