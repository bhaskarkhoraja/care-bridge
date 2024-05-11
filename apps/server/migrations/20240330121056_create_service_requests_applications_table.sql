-- table to store application of specific service request
CREATE TABLE IF NOT EXISTS service_request_application (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  applicant_profile_id UUID REFERENCES profile(id),
  service_request_id UUID REFERENCES service_request(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- descriptions
COMMENT ON TABLE service_request_application IS 'Stores the applications submitted to service requests';
COMMENT ON COLUMN service_request_application.id IS 'Unique identifier for the service request application';
COMMENT ON COLUMN service_request_application.applicant_profile_id IS 'Foreign key referencing the profile of the applicant';
COMMENT ON COLUMN service_request_application.service_request_id IS 'Foreign key referencing the service request to which the application is made';
COMMENT ON COLUMN service_request_application.created_at IS 'Timestamp of when the service request application was created';
COMMENT ON COLUMN service_request_application.updated_at IS 'Timestamp of the last update to the service request application';
