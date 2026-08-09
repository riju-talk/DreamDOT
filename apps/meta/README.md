# apps/meta

Ad Studio's backend — Meta OAuth, Instagram/Facebook story broadcasting, Marketing API campaigns. See `docs/PRD.md` §6.5.

## Status: real code, not yet usable

Every route is written against the real Graph API shape and will run — but none of it can succeed without a Meta developer app. `middleware/configured.js` returns a clear `503 META_NOT_CONFIGURED` on every route rather than failing deep inside a request with a confusing error.

## What's needed before this can go live

1. A Meta developer app at [developers.facebook.com](https://developers.facebook.com) — only Rijusmit can create this (it's tied to a Meta business account).
2. `META_APP_ID`, `META_APP_SECRET`, and a registered OAuth redirect URI, set in `.env`.
3. A decision on where OAuth tokens get stored — there is **no `MetaIntegration` table** in Postgres today (`docs/DATA_SCHEMA.md` §7 tracks this as explicitly out of scope until this service starts). `routes/oauth.js`'s `/callback` handler completes the token exchange but doesn't persist it yet — that's a real schema decision, not something to guess silently.

## Endpoints

| Method | Path | What it does | Testable today? |
|---|---|---|---|
| GET | `/oauth/authorize-url` | Builds the Meta OAuth consent URL | Once `META_APP_ID` + redirect URI are set |
| GET | `/oauth/callback` | Exchanges an auth code for an access token | Once credentials exist and a real OAuth flow completes |
| POST | `/broadcast/story` | Posts a DreamDOT image to IG/FB as a story | Needs a real page access token from a completed OAuth flow |
| POST | `/ads/campaign` | Creates a paused Marketing API campaign | Needs a real ad account + access token |

Campaigns are created with `status: PAUSED` deliberately — nothing should start spending real budget without an explicit activation step, which isn't built yet either.
