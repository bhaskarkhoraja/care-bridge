-- table to store any special needs of members like physically able
CREATE TABLE IF NOT EXISTS service_request_accepted (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  service_request_id UUID REFERENCES service_request(id),
  service_request_application_id UUID REFERENCES service_request_application(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
