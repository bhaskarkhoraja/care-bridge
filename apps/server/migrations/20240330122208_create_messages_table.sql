-- table to store messages
CREATE TYPE message_status AS ENUM ('open', 'close', 'spam');

CREATE TABLE IF NOT EXISTS message (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  sender_profile_id UUID REFERENCES profile(id),
  receiver_profile_id UUID REFERENCES profile(id),
  message TEXT NOT NULL,
  message_status message_status NOT NULL DEFAULT 'open',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--description
COMMENT ON TABLE message IS 'Profile Messages';
COMMENT ON COLUMN message.id IS 'Unique identifier for the message';
COMMENT ON COLUMN message.sender_profile_id IS 'Foreign key referencing the profile of the sender';
COMMENT ON COLUMN message.receiver_profile_id IS 'Foreign key referencing the profile of the receiver';
COMMENT ON COLUMN message.message_status IS 'Message status open, close or spam';
COMMENT ON COLUMN message.message IS 'Content of the message';
COMMENT ON COLUMN message.is_read IS 'Indicates if the message has been read';
COMMENT ON COLUMN message.created_at IS 'Timestamp of when the message was created';
COMMENT ON COLUMN message.updated_at IS 'Timestamp of the last update to the message';
