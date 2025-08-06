-- SECURITY POLICIES FOR AUTHENTICATION TABLES ONLY
-- Run this in Supabase SQL Editor to secure authentication

-- 1. ENABLE ROW LEVEL SECURITY ON AUTHENTICATION TABLES
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- 2. DROP EXISTING POLICIES (if any)
DROP POLICY IF EXISTS "admin_users_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_sessions_policy" ON admin_sessions;
DROP POLICY IF EXISTS "admin_activity_logs_policy" ON admin_activity_logs;

-- 3. CREATE SECURITY POLICIES FOR AUTHENTICATION

-- ADMIN_USERS: Only allow service role access (for authentication API)
CREATE POLICY "admin_users_service_role_only" ON admin_users
FOR ALL USING (auth.role() = 'service_role');

-- ADMIN_SESSIONS: Only allow service role access (for session management)
CREATE POLICY "admin_sessions_service_role_only" ON admin_sessions
FOR ALL USING (auth.role() = 'service_role');

-- ADMIN_ACTIVITY_LOGS: Only allow service role access (for audit logging)
CREATE POLICY "admin_activity_logs_service_role_only" ON admin_activity_logs
FOR ALL USING (auth.role() = 'service_role');

-- 4. GRANT NECESSARY PERMISSIONS TO SERVICE ROLE
GRANT ALL ON admin_users TO service_role;
GRANT ALL ON admin_sessions TO service_role;
GRANT ALL ON admin_activity_logs TO service_role;

-- 5. REVOKE UNNECESSARY PERMISSIONS FROM ANON ROLE
REVOKE ALL ON admin_users FROM anon;
REVOKE ALL ON admin_sessions FROM anon;
REVOKE ALL ON admin_activity_logs FROM anon;

-- 6. VERIFY SECURITY SETUP
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  CASE 
    WHEN rowsecurity THEN '🔒 SECURED'
    ELSE '⚠️ UNSECURED'
  END as security_status
FROM pg_tables 
WHERE tablename IN ('admin_users', 'admin_sessions', 'admin_activity_logs')
ORDER BY tablename;