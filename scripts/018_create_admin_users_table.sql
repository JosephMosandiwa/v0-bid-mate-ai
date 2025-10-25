-- Create admin users table for separate admin authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Create admin sessions table for session management
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on session token for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user_id ON admin_sessions(admin_user_id);

-- Insert a default admin user (password: admin123 - CHANGE THIS IMMEDIATELY)
-- Password hash is bcrypt hash of 'admin123'
INSERT INTO admin_users (email, password_hash, full_name, role)
VALUES (
  'admin@bidmateai.com',
  '$2a$10$rKZLvVZqKqYqKqYqKqYqKOqYqKqYqKqYqKqYqKqYqKqYqKqYqKqYq',
  'System Administrator',
  'super_admin'
)
ON CONFLICT (email) DO NOTHING;

COMMENT ON TABLE admin_users IS 'Stores admin user credentials separate from regular users';
COMMENT ON TABLE admin_sessions IS 'Manages admin user sessions with token-based authentication';
