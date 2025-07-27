# Database Management Guide

## 🗄️ Dual Database Support

Your FiveM Dashboard supports both **MySQL** and **PostgreSQL** databases. You can easily switch between them as needed.

## 🚀 Quick Setup

### For PostgreSQL (Current):
```bash
cd api
php setup_db.php
```

### For MySQL:
```bash
cd api
php switch_db.php mysql
php setup_db.php
```

## 🔄 Switching Databases

Use the database switcher utility:

```bash
# Switch to MySQL
php switch_db.php mysql

# Switch to PostgreSQL
php switch_db.php postgresql

# Check current configuration
php switch_db.php
```

## 📋 Default Credentials

After setup, you can login with:
- **Username**: `admin`
- **Password**: `password`

⚠️ **IMPORTANT**: Change the default password immediately after first login!

## 🔧 Manual Configuration

Edit `api/config/database.php`:

### PostgreSQL Configuration:
```php
define('DB_TYPE', 'postgresql');
define('DB_HOST', 'localhost');
define('DB_NAME', 'fivem_dashboard');
define('DB_USER', 'postgres');
define('DB_PASS', '');
define('DB_PORT', 5432);
```

### MySQL Configuration:
```php
define('DB_TYPE', 'mysql');
define('DB_HOST', 'localhost');
define('DB_NAME', 'fivem_dashboard');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_PORT', 3306);
```

## 📁 Schema Files

- **MySQL**: `sql/fivem_dashboard_mysql.sql`
- **PostgreSQL**: `sql/fivem_dashboard_postgresql.sql`

## 🐛 Troubleshooting

### Database Connection Issues:
1. Ensure PostgreSQL/MySQL is running in Laragon
2. Check database service status in Laragon control panel
3. Verify credentials in `api/config/database.php`
4. Run `php api/test_db.php` to test connection

### Registration/Login Issues:
1. Check if database schema was imported correctly
2. Verify admin user exists: `SELECT * FROM staff_accounts WHERE username = 'admin'`
3. Clear browser cache and cookies
4. Check browser console for JavaScript errors

### Schema Import Issues:
- For PostgreSQL: Make sure UUID extension is available
- For MySQL: Ensure MySQL version 8.0+ for JSON support
- Check file paths in setup script

## 🎯 Features by Database Type

### PostgreSQL Advantages:
- Native UUID support
- JSONB for better JSON performance
- Advanced indexing with GIN
- Built-in functions and triggers
- Better concurrent performance

### MySQL Advantages:
- More widespread hosting support
- Familiar to most developers
- JSON support (MySQL 8.0+)
- Better tooling ecosystem

## 🔒 Security Features

Both database configurations include:
- Password hashing with bcrypt
- Account lockout after failed attempts
- Activity logging with browser/OS detection
- Session management
- Input validation and sanitization
- Rate limiting

## 📊 Performance Optimization

The schemas include optimized indexes for:
- User authentication
- Chat message retrieval
- Task management
- Activity logging
- Online user tracking

## 🚀 Production Deployment

For production environments:
1. Use strong database passwords
2. Enable SSL/TLS connections
3. Configure proper backup strategies
4. Set up monitoring and logging
5. Use connection pooling for high traffic
6. Consider read replicas for scaling

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review error logs in Laragon
3. Test database connection with the test script
4. Verify schema integrity

---

**Your current setup**: PostgreSQL with Laragon
**Dashboard URL**: http://fivem_dashboard.test/
