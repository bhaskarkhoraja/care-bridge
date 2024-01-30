-- table to store messages
CREATE TABLE IF NOT EXISTS message (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  sender_profile_id UUID REFERENCES profile(id),
  reciever_profile_id UUID REFERENCES profile(id),
  message TEXT NOT NULL,
  parent_message_id UUID REFERENCES message(id),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  is_removed BOOLEAN NOT NULL DEFAULT FALSE,
  has_recieved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
