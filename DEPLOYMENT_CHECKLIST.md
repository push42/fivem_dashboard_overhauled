# 🚀 Quick Deployment Checklist

## Before You Start
- [ ] Node.js installed locally (for building)
- [ ] Web hosting with PHP 8.0+ and **MySQL OR PostgreSQL**
- [ ] Domain/subdomain ready (e.g., 5md.p42.studio)

## Step 1: Build Locally
```bash
npm install
npm run build
```
✅ Creates `dist/` folder with production files

## Step 2: Upload Files
Upload to your web hosting:
- [ ] All contents of `dist/` folder → to root directory
- [ ] `api/` folder → upload entire folder
- [ ] `sql/` folder → for database setup
- [ ] `.htaccess.production` → rename to `.htaccess`

## Step 3: Database Setup (Choose One)

### Option A: MySQL (Most Common)
- [ ] Create MySQL database in hosting panel
- [ ] Import `sql/fivem_dashboard_mysql.sql`
- [ ] Set `DB_TYPE` to `'mysql'` in `api/config/database.php`
- [ ] Update MySQL credentials in `api/config/database.php`

### Option B: PostgreSQL (Advanced)
- [ ] Create PostgreSQL database (if supported by hosting)
- [ ] Import `sql/fivem_dashboard_postgresql.sql`
- [ ] Set `DB_TYPE` to `'postgresql'` in `api/config/database.php`
- [ ] Update PostgreSQL credentials in `api/config/database.php`

## Step 4: Test
- [ ] Visit your domain (e.g., https://5md.p42.studio)
- [ ] Login with: `admin` / `password`
- [ ] Change default password immediately!
- [ ] Test all features work with mockup data

## 🎉 Done!
Your React 19.1 FiveM Dashboard is now live with:
- Modern React 19.1 performance
- Zero security vulnerabilities
- Mobile-responsive design
- Built-in mockup data for demos
- Production optimizations (compression, caching, etc.)

**Total time: ~15 minutes**

---
📖 **Need detailed instructions?** See [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)
