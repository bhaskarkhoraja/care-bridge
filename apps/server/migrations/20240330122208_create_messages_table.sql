-- table to store messages
CREATE TABLE IF NOT EXISTS message (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  sender_profile_id UUID REFERENCES profile(id),
  receiver_profile_id UUID REFERENCES profile(id),
  message TEXT NOT NULL,
  parent_message_id UUID REFERENCES message(id),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  is_removed BOOLEAN NOT NULL DEFAULT FALSE,
  has_received BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--description
COMMENT ON TABLE message IS 'Profile Messages';
COMMENT ON COLUMN message.id IS 'Unique identifier for the message';
COMMENT ON COLUMN message.sender_profile_id IS 'Foreign key referencing the profile of the sender';
COMMENT ON COLUMN message.receiver_profile_id IS 'Foreign key referencing the profile of the receiver';
COMMENT ON COLUMN message.message IS 'Content of the message';
COMMENT ON COLUMN message.parent_message_id IS 'Reference to the parent message if this is a reply';
COMMENT ON COLUMN message.is_read IS 'Indicates if the message has been read';
COMMENT ON COLUMN message.is_removed IS 'Indicates if the message has been removed';
COMMENT ON COLUMN message.has_received IS 'Indicates if the message has been received by the recipient';
COMMENT ON COLUMN message.created_at IS 'Timestamp of when the message was created';
COMMENT ON COLUMN message.updated_at IS 'Timestamp of the last update to the message';
