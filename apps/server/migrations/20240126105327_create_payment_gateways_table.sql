-- table to store document url
CREATE TABLE IF NOT EXISTS payment_gateway (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  checkout_url TEXT NOT NULL,
  cancel_url TEXT NOT NULL,
  response_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
