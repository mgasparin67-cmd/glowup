-- Apply alongside the trusted Apple transaction verification service.
-- No photo, questionnaire or card details are stored here.
CREATE TABLE IF NOT EXISTS app_subscription_access (
  subject_hash TEXT PRIMARY KEY NOT NULL,
  provider TEXT NOT NULL CHECK (provider = 'apple'),
  original_transaction_id TEXT UNIQUE NOT NULL,
  product_id TEXT NOT NULL,
  expires_at_ms INTEGER NOT NULL,
  revoked_at_ms INTEGER,
  verified_at_ms INTEGER NOT NULL
);
