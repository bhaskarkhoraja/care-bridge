-- table to store document url
CREATE TYPE user_document AS ENUM ('citizenship', 'passport', 'license');

CREATE TABLE IF NOT EXISTS document (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  profile_id UUID REFERENCES profile(id),
  document_url TEXT NOT NULL,
  document_type user_document,
  police_report_url TEXT NOT NULL,
  verified BOOLEAN DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- descriptions
COMMENT ON TABLE document IS 'Verification document of profile';
COMMENT ON COLUMN document.id IS 'Unique identifier for the document';
COMMENT ON COLUMN document.profile_id IS 'Foreign key referencing the profile to which the document belongs';
COMMENT ON COLUMN document.document_url IS 'URL pointing to the document';
COMMENT ON COLUMN document.document_type IS 'Type (citizenship, passport, license)';
COMMENT ON COLUMN document.police_report_url IS 'URL pointing to the police report related to the document';
COMMENT ON COLUMN document.verified IS 'Indicates if the document has been verified';
COMMENT ON COLUMN document.created_at IS 'Timestamp of when the document was created';
COMMENT ON COLUMN document.updated_at IS 'Timestamp of the last update to the document';
