-- Disable Row Level Security on admin tables
-- These tables should only be accessed by the service role key

-- Disable RLS on admin_users table
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Disable RLS on admin_sessions table
ALTER TABLE admin_sessions DISABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to service role
GRANT ALL ON admin_users TO service_role;
GRANT ALL ON admin_sessions TO service_role;

-- Also grant to authenticated role for service operations
GRANT SELECT, INSERT, UPDATE ON admin_users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_sessions TO authenticated;
