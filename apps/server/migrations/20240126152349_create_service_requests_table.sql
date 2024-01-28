-- table to store service requests
CREATE TABLE IF NOT EXISTS service_request (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  profile_id UUID REFERENCES profile(id),
  description TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT CHECK (status IN ('Open', 'Close')),
  prefered_language TEXT,
  strict_language BOOLEAN,
  prefered_gender TEXT CHECK (prefered_gender IN ('Male', 'Female')),
  strict_gender BOOLEAN,
  prefered_age INT,
  strict_age BOOLEAN,
  prefered_citizen TEXT,
  strict_citizen BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
