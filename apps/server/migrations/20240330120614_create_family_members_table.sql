-- table to store family member details
CREATE TABLE IF NOT EXISTS family_member (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  profile_id UUID REFERENCES profile(id),
  first_name VARCHAR(255) NOT NULL,
  middle_name VARCHAR(255),
  last_name VARCHAR(255) NOT NULL,
  gender user_gender,
  profile_url TEXT NOT NULL,
  date_of_birth TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- descriptions
COMMENT ON TABLE family_member IS 'Profiles family member details';
COMMENT ON COLUMN family_member.id IS 'Unique identifier for the family member';
COMMENT ON COLUMN family_member.profile_id IS 'Foreign key referencing the profile to which the family member belongs';
COMMENT ON COLUMN family_member.first_name IS 'First name of the family member';
COMMENT ON COLUMN family_member.middle_name IS 'Middle name of the family member (if available)';
COMMENT ON COLUMN family_member.last_name IS 'Last name of the family member';
COMMENT ON COLUMN family_member.gender IS 'Gender (male, female, others)';
COMMENT ON COLUMN family.profile_url IS 'URL pointing to the user profile image';
COMMENT ON COLUMN family_member.date_of_birth IS 'Date of birth of the family member';
COMMENT ON COLUMN family_member.updated_at IS 'Timestamp of the last update to the family member record';
COMMENT ON COLUMN family_member.created_at IS 'Timestamp of when the family member record was created';
