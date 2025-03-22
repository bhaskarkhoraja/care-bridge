-- table to store list of countries and nationalities
CREATE TABLE IF NOT EXISTS country (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  name VARCHAR(255) NOT NULL UNIQUE,
  nationality VARCHAR(255) NOT NULL UNIQUE,
  short_name VARCHAR(2) NOT NULL UNIQUE,
  country_code VARCHAR(5) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- descriptions
COMMENT ON TABLE country IS 'List of countries and nationalities';
COMMENT ON COLUMN country.id IS 'Unique identifier for the country';
COMMENT ON COLUMN country.name IS 'Full name of the country';
COMMENT ON COLUMN country.nationality IS 'Nationality associated with the country';
COMMENT ON COLUMN country.short_name IS 'Short name or code for the country';
COMMENT ON COLUMN country.country_code IS 'Phone code for the country';
COMMENT ON COLUMN country.created_at IS 'Timestamp of when the country record was created';
COMMENT ON COLUMN country.updated_at IS 'Timestamp of the last update to the country record';
