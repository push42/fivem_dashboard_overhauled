-- FiveM Dashboard 2.0 - MySQL Database Schema
-- Modern MySQL schema with improved data types, constraints, and indexing
SET FOREIGN_KEY_CHECKS = 0;
SET sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
-- Drop tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS user_logs;
DROP TABLE IF EXISTS todo_tasks;
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS online_users;
DROP TABLE IF EXISTS staff_accounts;
DROP TABLE IF EXISTS security_codes;
-- ----------------------------
-- Table structure for security_codes
-- ----------------------------
CREATE TABLE security_codes (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  code VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_security_codes_code (code)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for staff_accounts (Users)
-- ----------------------------
CREATE TABLE staff_accounts (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  -- Will store bcrypt hashes
  name VARCHAR(255) NOT NULL DEFAULT '',
  email VARCHAR(255) UNIQUE,
  avatar_url TEXT,
  security_code_id CHAR(36),
  rank ENUM(
    'Owner',
    'Admin',
    'Moderator',
    'Supporter',
    'User'
  ) NOT NULL DEFAULT 'Supporter',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP NULL,
  failed_login_attempts INT DEFAULT 0,
  locked_until TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  -- Foreign Keys
  FOREIGN KEY (security_code_id) REFERENCES security_codes(id) ON DELETE
  SET NULL,
    -- Indexes
    INDEX idx_staff_accounts_username (username),
    INDEX idx_staff_accounts_rank (rank),
    INDEX idx_staff_accounts_active (is_active),
    INDEX idx_staff_accounts_email (email)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for online_users
-- ----------------------------
CREATE TABLE online_users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  username VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  session_id VARCHAR(255),
  ip_address VARCHAR(45),
  -- IPv6 compatible
  user_agent TEXT,
  -- Prevent duplicate active sessions
  UNIQUE KEY unique_user_session (username, session_id),
  -- Indexes
  INDEX idx_online_users_username (username),
  INDEX idx_online_users_last_seen (last_seen),
  INDEX idx_online_users_session (session_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for chat_messages
-- ----------------------------
CREATE TABLE chat_messages (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  username VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  rank ENUM(
    'Owner',
    'Admin',
    'Moderator',
    'Supporter',
    'User',
    'VIP'
  ) NOT NULL DEFAULT 'User',
  is_deleted BOOLEAN DEFAULT false,
  edited_at TIMESTAMP NULL,
  reply_to_id CHAR(36),
  -- Foreign Keys
  FOREIGN KEY (reply_to_id) REFERENCES chat_messages(id) ON DELETE
  SET NULL,
    -- Constraints
    CONSTRAINT chk_message_length CHECK (
      CHAR_LENGTH(message) > 0
      AND CHAR_LENGTH(message) <= 2000
    ),
    -- Indexes
    INDEX idx_chat_messages_username (username),
    INDEX idx_chat_messages_timestamp (timestamp DESC),
    INDEX idx_chat_messages_rank (rank),
    INDEX idx_chat_messages_reply_to (reply_to_id),
    INDEX idx_chat_messages_deleted (is_deleted)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for todo_tasks
-- ----------------------------
CREATE TABLE todo_tasks (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
  due_date TIMESTAMP NULL,
  assigned_to CHAR(36),
  created_by CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  -- Foreign Keys
  FOREIGN KEY (assigned_to) REFERENCES staff_accounts(id) ON DELETE
  SET NULL,
    FOREIGN KEY (created_by) REFERENCES staff_accounts(id) ON DELETE
  SET NULL,
    -- Constraints
    CONSTRAINT chk_title_length CHECK (
      CHAR_LENGTH(title) > 0
      AND CHAR_LENGTH(title) <= 255
    ),
    -- Indexes
    INDEX idx_todo_tasks_completed (completed),
    INDEX idx_todo_tasks_priority (priority),
    INDEX idx_todo_tasks_due_date (due_date),
    INDEX idx_todo_tasks_assigned_to (assigned_to),
    INDEX idx_todo_tasks_created_by (created_by)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for user_logs (Enhanced Activity Logging)
-- ----------------------------
CREATE TABLE user_logs (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36),
  username VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  -- login, logout, create_task, etc.
  details JSON,
  -- Store additional action details
  ip_address VARCHAR(45),
  user_agent TEXT,
  browser VARCHAR(255),
  os VARCHAR(255),
  device_type VARCHAR(50),
  session_id VARCHAR(255),
  success BOOLEAN DEFAULT true,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Foreign Keys
  FOREIGN KEY (user_id) REFERENCES staff_accounts(id) ON DELETE CASCADE,
  -- Constraints
  CONSTRAINT chk_action_length CHECK (CHAR_LENGTH(action) > 0),
  -- Indexes
  INDEX idx_user_logs_user_id (user_id),
  INDEX idx_user_logs_username (username),
  INDEX idx_user_logs_action (action),
  INDEX idx_user_logs_timestamp (timestamp DESC),
  INDEX idx_user_logs_ip (ip_address),
  INDEX idx_user_logs_session (session_id),
  INDEX idx_user_logs_success (success)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
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
    WHEN ou.last_seen > DATE_SUB(NOW(), INTERVAL 5 MINUTE) THEN true
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
  SUM(
    CASE
      WHEN completed = true THEN 1
      ELSE 0
    END
  ) as completed_tasks,
  SUM(
    CASE
      WHEN completed = false THEN 1
      ELSE 0
    END
  ) as pending_tasks,
  SUM(
    CASE
      WHEN due_date < NOW()
      AND completed = false THEN 1
      ELSE 0
    END
  ) as overdue_tasks,
  SUM(
    CASE
      WHEN priority = 'Critical'
      AND completed = false THEN 1
      ELSE 0
    END
  ) as critical_tasks
FROM todo_tasks;
-- ----------------------------
-- Create stored procedures for common operations
-- ----------------------------
DELIMITER // -- Procedure to clean old chat messages (keep last 1000)
CREATE PROCEDURE CleanupOldChatMessages() BEGIN
DECLARE deleted_count INT DEFAULT 0;
UPDATE chat_messages cm1
  LEFT JOIN (
    SELECT id
    FROM chat_messages
    WHERE is_deleted = false
    ORDER BY timestamp DESC
    LIMIT 1000
  ) cm2 ON cm1.id = cm2.id
SET cm1.is_deleted = true
WHERE cm2.id IS NULL
  AND cm1.is_deleted = false;
SELECT ROW_COUNT() as deleted_count;
END // -- Procedure to clean old user logs (keep last 30 days)
CREATE PROCEDURE CleanupOldUserLogs() BEGIN
DECLARE deleted_count INT DEFAULT 0;
DELETE FROM user_logs
WHERE timestamp < DATE_SUB(NOW(), INTERVAL 30 DAY);
SELECT ROW_COUNT() as deleted_count;
END // -- Procedure to update user online status
CREATE PROCEDURE UpdateUserOnlineStatus(
  IN p_username VARCHAR(255),
  IN p_avatar_url TEXT,
  IN p_session_id VARCHAR(255),
  IN p_ip_address VARCHAR(45),
  IN p_user_agent TEXT
) BEGIN
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
    NOW()
  ) ON DUPLICATE KEY
UPDATE last_seen = NOW(),
  avatar_url = COALESCE(
    VALUES(avatar_url),
      avatar_url
  ),
  ip_address = COALESCE(
    VALUES(ip_address),
      ip_address
  ),
  user_agent = COALESCE(
    VALUES(user_agent),
      user_agent
  );
END // DELIMITER;
-- ----------------------------
-- Create triggers for automatic task completion tracking
-- ----------------------------
DELIMITER // CREATE TRIGGER set_todo_completed_at BEFORE
UPDATE ON todo_tasks FOR EACH ROW BEGIN IF NEW.completed = true
  AND OLD.completed = false THEN
SET NEW.completed_at = NOW();
ELSEIF NEW.completed = false
AND OLD.completed = true THEN
SET NEW.completed_at = NULL;
END IF;
END // DELIMITER;
-- ----------------------------
-- Create events for automatic cleanup (requires event scheduler)
-- ----------------------------
SET GLOBAL event_scheduler = ON;
CREATE EVENT IF NOT EXISTS cleanup_chat_messages ON SCHEDULE EVERY 1 DAY STARTS CURRENT_TIMESTAMP DO CALL CleanupOldChatMessages();
CREATE EVENT IF NOT EXISTS cleanup_user_logs ON SCHEDULE EVERY 1 DAY STARTS CURRENT_TIMESTAMP DO CALL CleanupOldUserLogs();
CREATE EVENT IF NOT EXISTS cleanup_online_users ON SCHEDULE EVERY 5 MINUTE STARTS CURRENT_TIMESTAMP DO
DELETE FROM online_users
WHERE last_seen < DATE_SUB(NOW(), INTERVAL 10 MINUTE);
SET FOREIGN_KEY_CHECKS = 1;
-- Display success message
SELECT 'FiveM Dashboard 2.0 MySQL schema created successfully!' as message;
SELECT 'Default admin user: admin / password (CHANGE THIS!)' as notice;
SELECT 'Remember to update your database configuration in api/config/database.php' as reminder;
