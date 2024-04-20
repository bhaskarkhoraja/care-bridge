-- table to store document url
CREATE TYPE user_gender AS ENUM ('male', 'female', 'others');

CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  first_name VARCHAR(255) NOT NULL,
  middle_name VARCHAR(255),
  last_name VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  gender user_gender,
  date_of_birth TIMESTAMPTZ NOT NULL,
  active_status BOOLEAN NOT NULL,
  profile_url TEXT,
  balance_exhausted INT NOT NULL DEFAULT 0,
  user_id UUID REFERENCES users(id) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- descriptions
COMMENT ON TABLE profile IS 'Profiles of users';
COMMENT ON COLUMN profile.id IS 'Unique identifier';
COMMENT ON COLUMN profile.first_name IS 'First name of the user';
COMMENT ON COLUMN profile.middle_name IS 'Middle name of the user (if available)';
COMMENT ON COLUMN profile.last_name IS 'Last name of the user';
COMMENT ON COLUMN profile.user_name IS 'User chosen username';
COMMENT ON COLUMN profile.gender IS 'gender (male, female, others)';
COMMENT ON COLUMN profile.date_of_birth IS 'Date of birth of the user';
COMMENT ON COLUMN profile.active_status IS 'Indicates if user is active';
COMMENT ON COLUMN profile.profile_url IS 'URL pointing to the user''s profile image';
COMMENT ON COLUMN profile.balance_exhausted IS 'Tracks the amount of balance exhausted';
COMMENT ON COLUMN profile.user_id IS 'Foreign key referencing the user';
COMMENT ON COLUMN profile.created_at IS 'Timestamp of when the profile was created';
COMMENT ON COLUMN profile.updated_at IS 'Timestamp of the last update to the profile';
