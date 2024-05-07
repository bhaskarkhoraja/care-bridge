-- table to store service requests
CREATE TYPE service_status AS ENUM ('open', 'close', 'draft');

CREATE TABLE IF NOT EXISTS service_request (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  profile_id UUID REFERENCES profile(id),
  description TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status service_status DEFAULT 'draft',
  prefered_language VARCHAR(255) DEFAULT NULL,
  mandatory_language BOOLEAN DEFAULT FALSE,
  prefered_gender user_gender,
  mandatory_gender BOOLEAN DEFAULT FALSE,
  prefered_age INT DEFAULT NULL,
  mandatory_age BOOLEAN DEFAULT FALSE,
  prefered_citizen VARCHAR(255) DEFAULT NULL,
  mandatory_citizen BOOLEAN DEFAULT FALSE,
  location TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- descriptions
COMMENT ON TABLE service_request IS 'Stores service requests';
COMMENT ON COLUMN service_request.id IS 'Unique identifier for the service request';
COMMENT ON COLUMN service_request.profile_id IS 'Foreign key referencing the profile associated with the service request';
COMMENT ON COLUMN service_request.description IS 'Description of the service request';
COMMENT ON COLUMN service_request.start_time IS 'Start time for the service request';
COMMENT ON COLUMN service_request.end_time IS 'End time for the service request';
COMMENT ON COLUMN service_request.status IS 'Status of the service request';
COMMENT ON COLUMN service_request.prefered_language IS 'Preferred language for the service';
COMMENT ON COLUMN service_request.mandatory_language IS 'Indicates if language preference is mandatory';
COMMENT ON COLUMN service_request.prefered_gender IS 'Preferred gender for the service provider';
COMMENT ON COLUMN service_request.mandatory_gender IS 'Indicates if gender preference is mandatory';
COMMENT ON COLUMN service_request.prefered_age IS 'Preferred age range for the service provider';
COMMENT ON COLUMN service_request.mandatory_age IS 'Indicates if age preference is mandatory';
COMMENT ON COLUMN service_request.prefered_citizen IS 'Preferred citizenship for the service provider';
COMMENT ON COLUMN service_request.mandatory_citizen IS 'Indicates if citizenship preference is mandatoray';
COMMENT ON COLUMN service_request.location IS 'Location of the service request';
COMMENT ON COLUMN service_request.created_at IS 'Timestamp of when the service request was created';
COMMENT ON COLUMN service_request.updated_at IS 'Timestamp of the last update to the service request';
