-- Add migration script here
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  service_request_accepted_id UUID REFERENCES service_request_accepted(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- descriptions
COMMENT ON TABLE payments IS 'Table to store which applicant were accepted';
COMMENT ON COLUMN payments.id IS 'Unique identifier for the accepted service request';
COMMENT ON COLUMN payments.service_request_accepted_id IS 'Foreign key referencing the service request that was accepted';
COMMENT ON COLUMN payments.created_at IS 'Timestamp of when the payment was done';
COMMENT ON COLUMN payments.updated_at IS 'Timestamp of the last update';
