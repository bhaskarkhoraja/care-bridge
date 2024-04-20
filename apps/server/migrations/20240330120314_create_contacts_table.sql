-- table to store contact
CREATE TABLE IF NOT EXISTS contact (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  number BIGINT NOT NULL,
  prefix VARCHAR(5) NOT NULL,
  phone_verified_at TIMESTAMPTZ,
  profile_id UUID REFERENCES profile(id) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- descriptions
COMMENT ON TABLE contact IS 'Contact information for a profile';
COMMENT ON COLUMN contact.id IS 'Unique identifier for the contact';
COMMENT ON COLUMN contact.number IS 'Contact number';
COMMENT ON COLUMN contact.phone_verified_at IS 'Timestamp of when the phone number was verified';
COMMENT ON COLUMN contact.profile_id IS 'Foreign key referencing the profile to which the contact belongs';
COMMENT ON COLUMN contact.created_at IS 'Timestamp of when the contact was created';
COMMENT ON COLUMN contact.updated_at IS 'Timestamp of the last update to the contact';
