CREATE TABLE verification_token
(
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,

  PRIMARY KEY (identifier, token)
);

CREATE TABLE accounts
(
  id UUID DEFAULT GEN_RANDOM_UUID(),
  "userId" UUID NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,

  PRIMARY KEY (id)
);

CREATE TABLE sessions
(
  id UUID DEFAULT GEN_RANDOM_UUID(),
  "userId" UUID NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL,

  PRIMARY KEY (id)
);

CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE user_type AS ENUM ('buyer', 'seller');

CREATE TABLE users
(
  id UUID DEFAULT GEN_RANDOM_UUID(),
  name VARCHAR(255),
  email VARCHAR(255),
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  role user_role,
  completed_profile BOOLEAN DEFAULT FALSE,
  type user_type DEFAULT 'buyer',

  PRIMARY KEY (id)
);

-- descriptions
COMMENT ON TABLE verification_token IS 'Verification token for magic links';
COMMENT ON COLUMN verification_token.identifier IS 'User email associated with the verification token';
COMMENT ON COLUMN verification_token.expires IS 'Expiry timestamp of the verification token';
COMMENT ON COLUMN verification_token.token IS 'Verification token value';


-- descriptions
COMMENT ON TABLE accounts IS 'Table to store user accounts and associated tokens';
COMMENT ON COLUMN accounts.id IS 'Unique identifier for the account';
COMMENT ON COLUMN accounts."userId" IS 'User ID associated with the account';
COMMENT ON COLUMN accounts.type IS 'Type of the account';
COMMENT ON COLUMN accounts.provider IS 'Provider of the account e.g, google, github';
COMMENT ON COLUMN accounts."providerAccountId" IS 'Provider account ID';
COMMENT ON COLUMN accounts.refresh_token IS 'Refresh token for the account';
COMMENT ON COLUMN accounts.access_token IS 'Access token for the account';
COMMENT ON COLUMN accounts.expires_at IS 'Expiry timestamp for the account';
COMMENT ON COLUMN accounts.id_token IS 'ID token for the account';
COMMENT ON COLUMN accounts.scope IS 'Scope of the account';
COMMENT ON COLUMN accounts.session_state IS 'Session state of the account';
COMMENT ON COLUMN accounts.token_type IS 'Type of token for the account';


-- descriptions
COMMENT ON TABLE sessions IS 'Table to store user sessions';
COMMENT ON COLUMN sessions.id IS 'Unique identifier for the session';
COMMENT ON COLUMN sessions."userId" IS 'User ID associated with the session';
COMMENT ON COLUMN sessions.expires IS 'Expiry timestamp of the session';
COMMENT ON COLUMN sessions."sessionToken" IS 'Session token value';

-- descriptions
COMMENT ON TABLE users IS 'Table to store user information';
COMMENT ON COLUMN users.id IS 'Unique identifier for the user';
COMMENT ON COLUMN users.name IS 'Name of the user';
COMMENT ON COLUMN users.email IS 'Email address of the user';
COMMENT ON COLUMN users."emailVerified" IS 'Timestamp of email verification';
COMMENT ON COLUMN users.image IS 'URL of the user image';
COMMENT ON COLUMN users.role IS 'Role (admin, user)';
COMMENT ON COLUMN users.completed_profile IS 'Indicates if the user has completed their profile';
COMMENT ON COLUMN users.type IS 'Stores if user is buyer or seller currently';
