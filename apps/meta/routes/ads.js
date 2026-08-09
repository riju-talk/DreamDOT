const express = require('express');
const router = express.Router();

const GRAPH_VERSION = 'v19.0';

/**
 * POST /ads/campaign
 * Creates a paid campaign from a DreamDOT post via the Marketing API.
 * Body: { adAccountId, accessToken, name, budgetCredits, objective }
 *
 * budgetCredits -> USD conversion and the actual credit deduction/Transaction
 * record are the web app's job (see docs/PRD.md §6.5 FR-5.3) — this route
 * only talks to Meta once the caller has already confirmed and reserved the spend.
 */
router.post('/campaign', async (req, res) => {
  const { adAccountId, accessToken, name, budgetCredits, objective = 'OUTCOME_TRAFFIC' } = req.body;

  if (!adAccountId || !accessToken || !name || !budgetCredits) {
    return res.status(400).json({ error: 'adAccountId, accessToken, name, and budgetCredits are required' });
  }

  try {
    const url = `https://graph.facebook.com/${GRAPH_VERSION}/act_${adAccountId}/campaigns`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        objective,
        status: 'PAUSED', // never auto-activate spend — creator must confirm in Ads Manager or a future FR
        special_ad_categories: [],
        access_token: accessToken,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      console.error('[meta] Campaign creation failed:', data);
      return res.status(502).json({ error: 'Meta rejected the campaign', detail: data });
    }

    res.json({ success: true, metaCampaignId: data.id });
  } catch (error) {
    console.error('[meta] Ads error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
