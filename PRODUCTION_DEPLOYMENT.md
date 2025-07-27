# FiveM Dashboard 2.0 - Production Deployment Guide

## 🚀 Quick Deployment Summary

**Ready to deploy?** This React 19.1 dashboard with mockup data can be hosted on any web server!

**Key highlights:**

- ✅ **Modern Stack**: React 19.1 + Vite + PHP 8.0+
- ✅ **Zero vulnerabilities**: All security issues fixed
- ✅ **Mockup data included**: Works without FiveM server
- ✅ **Production optimized**: 220KB bundle, code-split, cached
- ✅ **Mobile responsive**: Works on all devices

**Time to deploy: ~15 minutes** (including database setup)

---

## Hosting on 5md.p42.studio (Hetzner)

### Prerequisites

- Node.js (for building locally)
- PHP 8.0+ on your hosting
- **Database**: MySQL 8.0+ OR PostgreSQL 12+ (your choice!)

### Step 1: Build the Application Locally

```bash
# Install dependencies (if not already done)
npm install

# Build for production
npm run build
```

This creates a `dist/` folder with optimized production files.

### Step 2: Choose & Prepare Database

#### Option A: MySQL (Most Common for Shared Hosting)

1. **Create MySQL database** on your Hetzner hosting panel
2. **Update database credentials** in `api/config/database.production.php`:

   ```php
   // Choose MySQL
   define('DB_TYPE', 'mysql');
   define('DB_NAME', 'your_actual_database_name');
   define('DB_USER', 'your_database_username');
   define('DB_PASS', 'your_database_password');
   define('DB_HOST', 'localhost'); // or your DB host
   define('DB_PORT', 3306);

   // FiveM database (can be same for mockup data)
   define('FIVEM_DB_TYPE', 'mysql');
   define('FIVEM_DB_NAME', 'your_actual_database_name');
   define('FIVEM_DB_USER', 'your_database_username');
   define('FIVEM_DB_PASS', 'your_database_password');
   ```

3. **Import the MySQL schema**:
   - Upload `sql/fivem_dashboard_mysql.sql` to your hosting
   - Import via phpMyAdmin or command line: `mysql -u username -p database_name < fivem_dashboard_mysql.sql`

#### Option B: PostgreSQL (Advanced/VPS Hosting)

1. **Create PostgreSQL database** (if your hosting supports it)
2. **Update database credentials** in `api/config/database.production.php`:

   ```php
   // Choose PostgreSQL
   define('DB_TYPE', 'postgresql');
   define('DB_NAME', 'your_actual_database_name');
   define('DB_USER', 'your_database_username');
   define('DB_PASS', 'your_database_password');
   define('DB_HOST', 'localhost'); // or your DB host
   define('DB_PORT', 5432);

   // FiveM database (can be same for mockup data)
   define('FIVEM_DB_TYPE', 'postgresql');
   define('FIVEM_DB_NAME', 'your_actual_database_name');
   define('FIVEM_DB_USER', 'your_database_username');
   define('FIVEM_DB_PASS', 'your_database_password');
   ```

3. **Import the PostgreSQL schema**:
   - Upload `sql/fivem_dashboard_postgresql.sql` to your hosting
   - Import via command line: `psql -U username -d database_name -f fivem_dashboard_postgresql.sql`

> **💡 Recommendation**: Most shared hosting (like Hetzner webspace) supports MySQL by default. Use PostgreSQL only if you have VPS/dedicated hosting or specific PostgreSQL support.

### Step 3: Upload Files

Upload these files/folders to your subdomain folder (`5md.p42.studio`):

```
📁 5md.p42.studio/
├── 📁 dist/                    # Built React app (all contents)
│   ├── index.html
│   ├── assets/
│   └── ...
├── 📁 api/                     # PHP backend
│   ├── config/database.production.php (rename to database.php)
│   ├── cors_helper.php
│   ├── auth/
│   ├── fivem/
│   └── ...
├── 📁 img/                     # Images
├── 📁 sql/                     # Database files
├── .htaccess                   # From .htaccess.production
└── manifest.json
```

### Step 4: Configuration Changes

1. **Copy production config**:

   ```bash
   # On your server
   cp api/config/database.production.php api/config/database.php
   ```

2. **Copy production .htaccess**:

   ```bash
   cp .htaccess.production .htaccess
   ```

### Step 5: Test the Deployment

1. Visit `https://5md.p42.studio`
2. Try logging in with: `admin` / `password`
3. Test API endpoints work correctly

### Step 6: Security (Important!)

1. **Change default admin password** immediately
2. **Update database credentials** with strong passwords
3. **Remove/secure** any development files
4. **Test all functionality** with mockup data

## File Structure After Deployment

```
5md.p42.studio/
├── index.html              # React app entry point
├── assets/                 # CSS, JS, images
├── api/                    # PHP backend
├── img/                    # Static images
├── .htaccess               # Server configuration
└── manifest.json           # PWA manifest
```

## Database Features Comparison

Our dashboard supports both database systems with full feature parity:

| Feature | MySQL 8.0+ | PostgreSQL 12+ | Notes |
|---------|-------------|-----------------|-------|
| **Hosting Support** | ✅ Universal | ⚠️ VPS/Dedicated mostly | MySQL more common on shared hosting |
| **UUIDs** | ✅ Native UUID() | ✅ Native uuid_generate_v4() | Both support modern UUID primary keys |
| **JSON Support** | ✅ JSON data type | ✅ JSONB with GIN indexes | PostgreSQL slightly faster for JSON queries |
| **Constraints** | ✅ CHECK constraints | ✅ Advanced CHECK constraints | PostgreSQL has more validation options |
| **Performance** | ✅ Excellent | ✅ Excellent | Both optimized for dashboard workloads |
| **Mockup Data** | ✅ Included | ✅ Included | Same demo data for both systems |

**💡 Quick Decision Guide:**

- **Choose MySQL** if: Shared hosting, most common, easier setup
- **Choose PostgreSQL** if: VPS/dedicated server, advanced features needed

## Mockup Data

The application includes built-in mockup data for:

- ✅ Users and player management
- ✅ Vehicle management
- ✅ Chat system
- ✅ Todo tasks
- ✅ Server status
- ✅ Hall of Fame

Perfect for demonstrations without needing a real FiveM server!

## Production Features

- ✅ **React 19.1** - Latest React with best performance
- ✅ **Vite Build** - Optimized, fast loading
- ✅ **Code Splitting** - Lazy loading for better performance
- ✅ **Compression** - Gzip enabled via .htaccess
- ✅ **Caching** - Browser caching for static assets
- ✅ **Security Headers** - XSS protection, clickjacking prevention
- ✅ **SEO Ready** - Proper meta tags and structure

## Troubleshooting

### Database Connection Issues

#### MySQL Problems

- **"Connection refused"**: Check if MySQL is running and credentials are correct
- **"Access denied"**: Verify username/password and database permissions
- **"Database not found"**: Ensure database name matches exactly
- **"JSON functions missing"**: Upgrade to MySQL 8.0+ (required for modern features)

#### PostgreSQL Problems

- **"UUID extension missing"**: Run `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
- **"Permission denied"**: Check user privileges with `\du` command
- **"Connection limit reached"**: Increase `max_connections` in postgresql.conf
- **"Database not found"**: Verify database exists and user has access

### General Issues

1. **Check browser console** for JavaScript errors
2. **Verify database connection** in `api/config/database.php`
3. **Ensure PHP 8.0+** is enabled on your hosting
4. **Check .htaccess** is properly uploaded and mod_rewrite is enabled
5. **Test API endpoints** by visiting `https://5md.p42.studio/api/auth/check_session.php`

### File Upload Issues

- Ensure all `dist/` contents are in the root directory
- Verify `api/` folder maintains its structure
- Check file permissions (usually 644 for files, 755 for directories)
