const express = require('express');
const router = express.Router();

const GRAPH_VERSION = 'v19.0';

/**
 * POST /broadcast/story
 * Pushes a DreamDOT post to a linked Instagram/Facebook account as a story.
 * Body: { pageAccessToken, igUserId, imageUrl }
 *
 * Real Graph API shape, but untestable without a live access token from a
 * completed OAuth flow (see routes/oauth.js) — do not treat "compiles" as
 * "verified" for this route until that's true.
 */
router.post('/story', async (req, res) => {
  const { pageAccessToken, igUserId, imageUrl } = req.body;

  if (!pageAccessToken || !igUserId || !imageUrl) {
    return res.status(400).json({ error: 'pageAccessToken, igUserId, and imageUrl are required' });
  }

  try {
    // Step 1: create a media container
    const containerUrl = `https://graph.facebook.com/${GRAPH_VERSION}/${igUserId}/media`;
    const containerRes = await fetch(containerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        media_type: 'STORIES',
        access_token: pageAccessToken,
      }),
    });
    const containerData = await containerRes.json();
    if (!containerRes.ok) {
      console.error('[meta] Story container creation failed:', containerData);
      return res.status(502).json({ error: 'Meta rejected the story container', detail: containerData });
    }

    // Step 2: publish it
    const publishUrl = `https://graph.facebook.com/${GRAPH_VERSION}/${igUserId}/media_publish`;
    const publishRes = await fetch(publishUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: containerData.id, access_token: pageAccessToken }),
    });
    const publishData = await publishRes.json();
    if (!publishRes.ok) {
      console.error('[meta] Story publish failed:', publishData);
      return res.status(502).json({ error: 'Meta rejected the story publish', detail: publishData });
    }

    res.json({ success: true, mediaId: publishData.id });
  } catch (error) {
    console.error('[meta] Broadcast error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
