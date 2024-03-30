-- table to store family member in specific service request
CREATE TABLE IF NOT EXISTS service_request_member (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  family_member_id UUID REFERENCES family_member(id),
  service_request_id UUID REFERENCES service_request(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- descriptions
COMMENT ON TABLE service_request_member IS 'Stores the family members in the service request';
COMMENT ON COLUMN service_request_member.id IS 'Unique identifier for the service request member';
COMMENT ON COLUMN service_request_member.family_member_id IS 'Foreign key referencing the family member associated with the service request';
COMMENT ON COLUMN service_request_member.service_request_id IS 'Foreign key referencing the service request';
COMMENT ON COLUMN service_request_member.created_at IS 'Timestamp of when the service request member record was created';
COMMENT ON COLUMN service_request_member.updated_at IS 'Timestamp of the last update to the service request member record';
