-- table to store any special needs of members like physically able
CREATE TABLE IF NOT EXISTS service_request_accepted (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  service_request_id UUID REFERENCES service_request(id),
  service_request_application_id UUID REFERENCES service_request_application(id),
  accepted_profile_id UUID REFERENCES profile(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- descriptions
COMMENT ON TABLE service_request_accepted IS 'Table to store which applicant were accepted';
COMMENT ON COLUMN service_request_accepted.id IS 'Unique identifier for the accepted service request';
COMMENT ON COLUMN service_request_accepted.service_request_id IS 'Foreign key referencing the service request that was accepted';
COMMENT ON COLUMN service_request_accepted.service_request_application_id IS 'Foreign key referencing the service request application that was accepted';
COMMENT ON COLUMN service_request_accepted.accepted_profile_id IS 'Foreign key referencing the profile of the user who got accepted for service request';
COMMENT ON COLUMN service_request_accepted.created_at IS 'Timestamp of when the service request was accepted';
COMMENT ON COLUMN service_request_accepted.updated_at IS 'Timestamp of the last update to the accepted service request';
