-- table to store document url
CREATE TABLE IF NOT EXISTS document (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  identity_type TEXT CHECK (identity_type IN ('passport', 'citizenship', 'driving license')),
  identity_url TEXT NOT NULL,
  police_report_url TEXT NOT NULL,
  verified BOOLEAN DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
