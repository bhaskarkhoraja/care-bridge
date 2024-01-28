-- table to store any special needs of members like physically able
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  family_member_id UUID REFERENCES family_member(id),
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
