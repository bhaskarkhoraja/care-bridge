-- table to store family member in specific service request
CREATE TABLE IF NOT EXISTS service_request (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  profile_id UUID REFERENCES profile(id),
  service_request_id UUID REFERENCES service_request(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
