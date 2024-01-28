-- table to store login logs
CREATE TABLE IF NOT EXISTS log (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  profile_id UUID REFERENCES profile(id),
  action TEXT CHECK (action IN ('Login', 'Logout')),
  ip_address TEXT NOT NULL,
  location TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
