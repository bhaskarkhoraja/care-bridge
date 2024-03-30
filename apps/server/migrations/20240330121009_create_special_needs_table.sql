-- table to store any special needs of members like physically able
CREATE TABLE IF NOT EXISTS special_needs (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  family_member_id UUID REFERENCES family_member(id),
  description TEXT NOT NULL,
  description_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- descriptions
COMMENT ON TABLE special_needs IS 'Stores any special needs of members like physically able';
COMMENT ON COLUMN special_needs.id IS 'Unique identifier for the special need';
COMMENT ON COLUMN special_needs.family_member_id IS 'Foreign key referencing the family member associated with the special need';
COMMENT ON COLUMN special_needs.description IS 'Description of the special need';
COMMENT ON COLUMN special_needs.description_url IS 'URL pointing to additional information about the special need';
COMMENT ON COLUMN special_needs.created_at IS 'Timestamp of when the special need record was created';
COMMENT ON COLUMN special_needs.updated_at IS 'Timestamp of the last update to the special need record';
