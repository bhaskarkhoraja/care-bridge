-- table to store address, can store permanent and current
CREATE TABLE IF NOT EXISTS address (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  profile_id UUID REFERENCES profile(id) UNIQUE NOT NULL,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  postal_code VARCHAR(255) NOT NULL,
  country_id UUID REFERENCES country(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- descriptions
COMMENT ON TABLE address IS 'Address of profile';
COMMENT ON COLUMN address.id IS 'Unique identifier for the address';
COMMENT ON COLUMN address.profile_id IS 'Foreign key referencing the profile to which the address belongs';
COMMENT ON COLUMN address.street IS 'Street address';
COMMENT ON COLUMN address.city IS 'City of the address';
COMMENT ON COLUMN address.state IS 'State or region of the address';
COMMENT ON COLUMN address.postal_code IS 'Postal code of the address';
COMMENT ON COLUMN address.country_id IS 'Country of the address';
COMMENT ON COLUMN address.created_at IS 'Timestamp of when the address was created';
COMMENT ON COLUMN address.updated_at IS 'Timestamp of the last update to the address';
