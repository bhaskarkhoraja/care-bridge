-- table to store contact
CREATE TABLE IF NOT EXISTS contact (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  number TEXT NOT NULL,
  prefix TEXT NOT NULL,
  type TEXT CHECK (type IN ('Telephone', 'Mobile')),
  profile_id UUID REFERENCES profile(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
