-- table to store document url
CREATE TABLE IF NOT EXISTS family_document (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  family_member_id UUID REFERENCES family_member(id) UNIQUE NOT NULL,
  document_url TEXT NOT NULL,
  police_report_url TEXT NOT NULL,
  verified BOOLEAN DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- descriptions
COMMENT ON TABLE family_document IS 'Verification document of family member';
COMMENT ON COLUMN family_document.id IS 'Unique identifier for the document';
COMMENT ON COLUMN family_document.family_member_id IS 'Foreign key referencing the family member to which the document belongs';
COMMENT ON COLUMN family_document.document_url IS 'URL pointing to the document';
COMMENT ON COLUMN family_document.police_report_url IS 'URL pointing to the police report related to the document';
COMMENT ON COLUMN family_document.verified IS 'Indicates if the document has been verified';
COMMENT ON COLUMN family_document.created_at IS 'Timestamp of when the document was created';
COMMENT ON COLUMN family_document.updated_at IS 'Timestamp of the last update to the document';
