/**
 * Every Meta-facing route is real code, but useless without real credentials.
 * This guard returns a clear, honest error instead of failing deep inside
 * the Graph/Marketing API SDK with a cryptic message.
 */
function requireMetaCredentials(req, res, next) {
  if (!process.env.META_APP_ID || !process.env.META_APP_SECRET) {
    return res.status(503).json({
      error: 'Ad Studio is not configured',
      code: 'META_NOT_CONFIGURED',
      detail: 'META_APP_ID and META_APP_SECRET must be set — create a Meta developer app first. See apps/meta/README.md.',
    });
  }
  next();
}

module.exports = { requireMetaCredentials };
