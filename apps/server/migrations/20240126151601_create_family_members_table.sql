-- table to store family member details
CREATE TABLE IF NOT EXISTS family_member (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  profile_id UUID REFERENCES profile(id),
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Others')),
  date_of_birth TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
