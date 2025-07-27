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
- MySQL database on your hosting

### Step 1: Build the Application Locally

```bash
# Install dependencies (if not already done)
npm install

# Build for production
npm run build
```

This creates a `dist/` folder with optimized production files.

### Step 2: Prepare Database

1. **Create MySQL database** on your Hetzner hosting panel
2. **Update database credentials** in `api/config/database.production.php`:

   ```php
   define('DB_NAME', 'your_actual_database_name');
   define('DB_USER', 'your_database_username');
   define('DB_PASS', 'your_database_password');
   ```

3. **Import the database schema**:
   - Upload `sql/fivem_dashboard_mysql.sql` to your hosting
   - Import it via phpMyAdmin or command line

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

## Support

If you encounter issues:

1. Check browser console for errors
2. Verify database connection in `api/config/database.php`
3. Ensure PHP 8.0+ is enabled on your hosting
4. Check .htaccess is properly uploaded and mod_rewrite is enabled
