-- table to store address, can store permanent and current
CREATE TABLE IF NOT EXISTS address (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  province TEXT NOT NULL,
  street TEXT NOT NULL,
  type TEXT CHECK (type IN ('Permanent', 'Current')),
  postal_code TEXT NOT NULL,
  residence_number TEXT NOT NULL,
  profile_id UUID REFERENCES profile(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
