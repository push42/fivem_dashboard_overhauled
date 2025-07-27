-- FiveM Dashboard 2.0 - PostgreSQL Database Schema
-- Modern PostgreSQL schema with improved data types, constraints, and indexing
-- Enable UUID extension for better primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Drop tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS user_logs CASCADE;
DROP TABLE IF EXISTS todo_tasks CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS online_users CASCADE;
DROP TABLE IF EXISTS staff_accounts CASCADE;
DROP TABLE IF EXISTS security_codes CASCADE;
-- ----------------------------
-- Table structure for security_codes
-- ----------------------------
CREATE TABLE security_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ language 'plpgsql';
CREATE TRIGGER update_security_codes_updated_at BEFORE
UPDATE ON security_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ----------------------------
-- Table structure for staff_accounts (Users)
-- ----------------------------
CREATE TABLE staff_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  -- Will store bcrypt hashes
  name VARCHAR(255) NOT NULL DEFAULT '',
  email VARCHAR(255) UNIQUE,
  avatar_url TEXT,
  security_code_id UUID REFERENCES security_codes(id) ON DELETE
  SET NULL,
    rank VARCHAR(50) NOT NULL DEFAULT 'Supporter',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Constraints
    CONSTRAINT valid_rank CHECK (
      rank IN (
        'Owner',
        'Admin',
        'Moderator',
        'Supporter',
        'User'
      )
    ),
    CONSTRAINT valid_email CHECK (
      email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    )
);
-- Create indexes for performance
CREATE INDEX idx_staff_accounts_username ON staff_accounts(username);
CREATE INDEX idx_staff_accounts_rank ON staff_accounts(rank);
CREATE INDEX idx_staff_accounts_active ON staff_accounts(is_active);
-- Create trigger for updated_at
CREATE TRIGGER update_staff_accounts_updated_at BEFORE
UPDATE ON staff_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ----------------------------
-- Table structure for online_users
-- ----------------------------
CREATE TABLE online_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  -- Prevent duplicate active sessions
  UNIQUE(username, session_id)
);
-- Create indexes
CREATE INDEX idx_online_users_username ON online_users(username);
CREATE INDEX idx_online_users_last_seen ON online_users(last_seen);
CREATE INDEX idx_online_users_session ON online_users(session_id);
-- ----------------------------
-- Table structure for chat_messages
-- ----------------------------
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  rank VARCHAR(255) NOT NULL DEFAULT 'User',
  is_deleted BOOLEAN DEFAULT false,
  edited_at TIMESTAMP WITH TIME ZONE,
  reply_to_id UUID REFERENCES chat_messages(id) ON DELETE
  SET NULL,
    -- Constraints
    CONSTRAINT valid_message_length CHECK (
      LENGTH(message) > 0
      AND LENGTH(message) <= 2000
    ),
    CONSTRAINT valid_rank CHECK (
      rank IN (
        'Owner',
        'Admin',
        'Moderator',
        'Supporter',
        'User',
        'VIP'
      )
    )
);
-- Create indexes
CREATE INDEX idx_chat_messages_username ON chat_messages(username);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp DESC);
CREATE INDEX idx_chat_messages_rank ON chat_messages(rank);
CREATE INDEX idx_chat_messages_reply_to ON chat_messages(reply_to_id);
-- ----------------------------
-- Table structure for todo_tasks
-- ----------------------------
CREATE TABLE todo_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  priority VARCHAR(20) DEFAULT 'Medium',
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES staff_accounts(id) ON DELETE
  SET NULL,
    created_by UUID REFERENCES staff_accounts(id) ON DELETE
  SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    -- Constraints
    CONSTRAINT valid_priority CHECK (
      priority IN ('Low', 'Medium', 'High', 'Critical')
    ),
    CONSTRAINT valid_title_length CHECK (
      LENGTH(title) > 0
      AND LENGTH(title) <= 255
    )
);
-- Create indexes
CREATE INDEX idx_todo_tasks_completed ON todo_tasks(completed);
CREATE INDEX idx_todo_tasks_priority ON todo_tasks(priority);
CREATE INDEX idx_todo_tasks_due_date ON todo_tasks(due_date);
CREATE INDEX idx_todo_tasks_assigned_to ON todo_tasks(assigned_to);
CREATE INDEX idx_todo_tasks_created_by ON todo_tasks(created_by);
-- Create trigger for updated_at
CREATE TRIGGER update_todo_tasks_updated_at BEFORE
UPDATE ON todo_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Trigger to set completed_at when task is completed
CREATE OR REPLACE FUNCTION set_completed_at() RETURNS TRIGGER AS $$ BEGIN IF NEW.completed = true
  AND OLD.completed = false THEN NEW.completed_at = CURRENT_TIMESTAMP;
ELSIF NEW.completed = false
AND OLD.completed = true THEN NEW.completed_at = NULL;
END IF;
RETURN NEW;
END;
$$ language 'plpgsql';
CREATE TRIGGER set_todo_completed_at BEFORE
UPDATE ON todo_tasks FOR EACH ROW EXECUTE FUNCTION set_completed_at();
-- ----------------------------
-- Table structure for user_logs (Enhanced Activity Logging)
-- ----------------------------
CREATE TABLE user_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES staff_accounts(id) ON DELETE CASCADE,
  username VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  -- login, logout, create_task, etc.
  details JSONB,
  -- Store additional action details
  ip_address INET,
  user_agent TEXT,
  browser VARCHAR(255),
  os VARCHAR(255),
  device_type VARCHAR(50),
  session_id VARCHAR(255),
  success BOOLEAN DEFAULT true,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Performance indexes
  CONSTRAINT valid_action CHECK (LENGTH(action) > 0)
);
-- Create indexes for logs
CREATE INDEX idx_user_logs_user_id ON user_logs(user_id);
CREATE INDEX idx_user_logs_username ON user_logs(username);
CREATE INDEX idx_user_logs_action ON user_logs(action);
CREATE INDEX idx_user_logs_timestamp ON user_logs(timestamp DESC);
CREATE INDEX idx_user_logs_ip ON user_logs(ip_address);
CREATE INDEX idx_user_logs_session ON user_logs(session_id);
-- JSONB index for details column
CREATE INDEX idx_user_logs_details ON user_logs USING GIN (details);
-- ----------------------------
-- Insert default security codes
-- ----------------------------
INSERT INTO security_codes (code, description)
VALUES ('123456789', 'Default admin code'),
  ('ADMIN2024', 'Admin access code'),
  ('MOD2024', 'Moderator access code'),
  ('SUPPORT2024', 'Support team access code');
-- ----------------------------
-- Create default admin user
-- ----------------------------
INSERT INTO staff_accounts (username, password, name, rank, email)
VALUES (
    'admin',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'System Administrator',
    'Owner',
    'admin@fivem-dashboard.local'
  );
-- Default password is 'password' (change this immediately!)
-- ----------------------------
-- Create views for common queries
-- ----------------------------
CREATE VIEW active_users AS
SELECT sa.id,
  sa.username,
  sa.name,
  sa.rank,
  sa.avatar_url,
  sa.last_login,
  ou.last_seen,
  CASE
    WHEN ou.last_seen > CURRENT_TIMESTAMP - INTERVAL '5 minutes' THEN true
    ELSE false
  END AS is_online
FROM staff_accounts sa
  LEFT JOIN online_users ou ON sa.username = ou.username
WHERE sa.is_active = true;
-- View for recent chat activity
CREATE VIEW recent_chat AS
SELECT cm.id,
  cm.username,
  cm.message,
  cm.timestamp,
  cm.rank,
  cm.avatar_url,
  cm.reply_to_id
FROM chat_messages cm
WHERE cm.is_deleted = false
ORDER BY cm.timestamp DESC;
-- View for task statistics
CREATE VIEW task_stats AS
SELECT COUNT(*) as total_tasks,
  COUNT(
    CASE
      WHEN completed = true THEN 1
    END
  ) as completed_tasks,
  COUNT(
    CASE
      WHEN completed = false THEN 1
    END
  ) as pending_tasks,
  COUNT(
    CASE
      WHEN due_date < CURRENT_TIMESTAMP
      AND completed = false THEN 1
    END
  ) as overdue_tasks,
  COUNT(
    CASE
      WHEN priority = 'Critical'
      AND completed = false THEN 1
    END
  ) as critical_tasks
FROM todo_tasks;
-- ----------------------------
-- Create functions for common operations
-- ----------------------------
-- Function to clean old chat messages (keep last 1000)
CREATE OR REPLACE FUNCTION cleanup_old_chat_messages() RETURNS INTEGER AS $$
DECLARE deleted_count INTEGER;
BEGIN WITH messages_to_keep AS (
  SELECT id
  FROM chat_messages
  WHERE is_deleted = false
  ORDER BY timestamp DESC
  LIMIT 1000
)
UPDATE chat_messages
SET is_deleted = true
WHERE id NOT IN (
    SELECT id
    FROM messages_to_keep
  )
  AND is_deleted = false;
GET DIAGNOSTICS deleted_count = ROW_COUNT;
RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
-- Function to clean old user logs (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_user_logs() RETURNS INTEGER AS $$
DECLARE deleted_count INTEGER;
BEGIN
DELETE FROM user_logs
WHERE timestamp < CURRENT_TIMESTAMP - INTERVAL '30 days';
GET DIAGNOSTICS deleted_count = ROW_COUNT;
RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
-- Function to update user online status
CREATE OR REPLACE FUNCTION update_user_online_status(
    p_username VARCHAR(255),
    p_avatar_url TEXT DEFAULT NULL,
    p_session_id VARCHAR(255) DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
  ) RETURNS VOID AS $$ BEGIN
INSERT INTO online_users (
    username,
    avatar_url,
    session_id,
    ip_address,
    user_agent,
    last_seen
  )
VALUES (
    p_username,
    p_avatar_url,
    p_session_id,
    p_ip_address,
    p_user_agent,
    CURRENT_TIMESTAMP
  ) ON CONFLICT (username, session_id) DO
UPDATE
SET last_seen = CURRENT_TIMESTAMP,
  avatar_url = COALESCE(EXCLUDED.avatar_url, online_users.avatar_url),
  ip_address = COALESCE(EXCLUDED.ip_address, online_users.ip_address),
  user_agent = COALESCE(EXCLUDED.user_agent, online_users.user_agent);
END;
$$ LANGUAGE plpgsql;
-- ----------------------------
-- Set up automatic cleanup jobs (requires pg_cron extension)
-- ----------------------------
-- Uncomment these if you have pg_cron installed:
-- SELECT cron.schedule('cleanup-chat', '0 2 * * *', 'SELECT cleanup_old_chat_messages();');
-- SELECT cron.schedule('cleanup-logs', '0 3 * * *', 'SELECT cleanup_old_user_logs();');
-- SELECT cron.schedule('cleanup-online-users', '*/5 * * * *', 'DELETE FROM online_users WHERE last_seen < CURRENT_TIMESTAMP - INTERVAL ''10 minutes'';');
COMMIT;
-- ----------------------------
-- Grant permissions (adjust as needed)
-- ----------------------------
-- Create dashboard user (optional)
-- CREATE USER dashboard_user WITH PASSWORD 'your_secure_password';
-- GRANT CONNECT ON DATABASE your_database TO dashboard_user;
-- GRANT USAGE ON SCHEMA public TO dashboard_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO dashboard_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO dashboard_user;
-- Display success message
DO $$ BEGIN RAISE NOTICE 'FiveM Dashboard 2.0 PostgreSQL schema created successfully!';
RAISE NOTICE 'Default admin user: admin / password (CHANGE THIS!)';
RAISE NOTICE 'Remember to update your database configuration in api/config/database.php';
END $$;
