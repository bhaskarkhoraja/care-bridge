-- table to store document url
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  profile_enabled TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Others')),
  date_of_birth TIMESTAMPTZ NOT NULL,
  type TEXT CHECK (gender IN ('Admin', 'Buyer', 'Seller')),
  active_status BOOLEAN NOT NULL,
  last_active TIMESTAMPTZ NOT NULL,
  profile_url TEXT,
  access_token TEXT NOT NULL,
  document_id UUID REFERENCES document(id),
  balance INT NOT NULL,
  balance_exhausted INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
