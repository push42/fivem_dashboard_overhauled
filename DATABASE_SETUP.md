# Database Setup Guide - FiveM Dashboard 2.0

This guide will help you set up either MySQL or PostgreSQL for your FiveM Dashboard.

## Quick Setup

### 1. Choose Your Database

Edit `api/config/database.php` and set your database type:

```php
// For MySQL
define('DB_TYPE', 'mysql');

// For PostgreSQL
define('DB_TYPE', 'postgresql');
```

### 2. Configure Connection Settings

```php
// Main Dashboard Database
define('DB_HOST', 'localhost');
define('DB_NAME', 'fivem_dashboard');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');

// FiveM Server Database (can be different type)
define('FIVEM_DB_TYPE', 'mysql'); // or 'postgresql'
define('FIVEM_DB_HOST', 'localhost');
define('FIVEM_DB_NAME', 'your_fivem_database');
define('FIVEM_DB_USER', 'your_fivem_user');
define('FIVEM_DB_PASS', 'your_fivem_password');
```

### 3. Import Database Schema

#### For MySQL:
```bash
mysql -u root -p fivem_dashboard < sql/fivem_dashboard_mysql.sql
```

#### For PostgreSQL:
```bash
psql -U postgres -d fivem_dashboard -f sql/fivem_dashboard_postgresql.sql
```

## Database Features Comparison

| Feature | MySQL | PostgreSQL |
|---------|-------|------------|
| UUIDs | CHAR(36) with UUID() | Native UUID with uuid_generate_v4() |
| JSON | JSON data type | JSONB with GIN indexes |
| Constraints | CHECK constraints | Advanced CHECK constraints |
| Arrays | JSON arrays | Native array support |
| Full Text Search | FULLTEXT indexes | Built-in full text search |
| Auto Cleanup | Events | Cron jobs (pg_cron) |

## Schema Features

### Modern Improvements:
- **UUID Primary Keys** - Better for distributed systems
- **Proper Constraints** - Data validation at database level
- **JSON Support** - Flexible data storage for logs and details
- **Indexes** - Optimized performance for common queries
- **Foreign Keys** - Data integrity enforcement
- **Automatic Timestamps** - created_at/updated_at tracking
- **Soft Deletes** - Mark records as deleted instead of removing

### Enhanced Tables:

#### staff_accounts
- UUID primary keys
- Email validation
- Account locking after failed attempts
- Activity tracking
- Proper password hashing support

#### chat_messages
- Message threading (reply_to_id)
- Soft delete functionality
- Message length validation
- Enhanced ranking system

#### todo_tasks
- Priority levels (Low, Medium, High, Critical)
- Assignment system
- Due dates
- Automatic completion tracking

#### user_logs
- Comprehensive activity logging
- JSON details storage
- Device/browser tracking
- Performance indexes

### Database Functions/Procedures:

#### MySQL Stored Procedures:
- `CleanupOldChatMessages()` - Maintains chat history
- `CleanupOldUserLogs()` - Removes old log entries
- `UpdateUserOnlineStatus()` - Manages online users

#### PostgreSQL Functions:
- `cleanup_old_chat_messages()` - Chat maintenance
- `cleanup_old_user_logs()` - Log cleanup
- `update_user_online_status()` - Online status management

### Automatic Maintenance:

#### MySQL Events:
- Daily chat message cleanup
- Daily log cleanup
- 5-minute online user cleanup

#### PostgreSQL (with pg_cron):
- Scheduled cleanup jobs
- Automatic maintenance tasks

## Migration from Old Schema

If you're upgrading from the old MySQL schema:

1. **Backup your data:**
   ```bash
   mysqldump -u root -p old_database > backup.sql
   ```

2. **Create new database:**
   ```bash
   mysql -u root -p -e "CREATE DATABASE fivem_dashboard;"
   ```

3. **Import new schema:**
   ```bash
   mysql -u root -p fivem_dashboard < sql/fivem_dashboard_mysql.sql
   ```

4. **Migrate your data** (you'll need to write migration scripts for your specific data)

## Performance Tuning

### MySQL Configuration (my.cnf):
```ini
[mysqld]
innodb_buffer_pool_size = 128M
max_connections = 200
query_cache_size = 64M
tmp_table_size = 64M
max_heap_table_size = 64M
```

### PostgreSQL Configuration (postgresql.conf):
```ini
shared_buffers = 128MB
effective_cache_size = 512MB
work_mem = 4MB
maintenance_work_mem = 64MB
```

## Security Considerations

1. **Use strong passwords** for database users
2. **Limit database user permissions** to only required tables
3. **Enable SSL connections** in production
4. **Regular backups** with encryption
5. **Monitor failed login attempts**
6. **Keep database software updated**

## Troubleshooting

### Common MySQL Issues:
- **UUID not supported**: Upgrade to MySQL 8.0+ or use CHAR(36)
- **JSON functions missing**: Upgrade to MySQL 5.7+
- **Event scheduler disabled**: `SET GLOBAL event_scheduler = ON;`

### Common PostgreSQL Issues:
- **UUID extension missing**: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
- **Permission denied**: Check user privileges with `\du`
- **Connection limit reached**: Increase `max_connections`

### FiveM Integration Issues:
- **ESX compatibility**: Make sure column names match your ESX version
- **QBCore compatibility**: Adjust player data queries for QBCore format
- **Custom frameworks**: Modify queries to match your database schema

## Default Login

After running the schema, you can log in with:
- **Username**: admin
- **Password**: password

**⚠️ IMPORTANT: Change this password immediately after first login!**

## Need Help?

Check the logs in `api/logs/` directory for detailed error information, or review the database connection settings in `api/config/database.php`.
