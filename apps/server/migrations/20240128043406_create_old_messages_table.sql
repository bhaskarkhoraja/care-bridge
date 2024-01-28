-- table to store messages
CREATE TABLE IF NOT EXISTS old_message (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  message_id UUID REFERENCES message(id),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
