# 🚀 Development Workflow Guide

## 🔄 Development vs Production

### Development Mode (`npm run dev`)

- **Purpose**: For active development and testing
- **URL**: `http://fivem_dashboard.test:3000` (React dev server on your custom domain)
- **API**: Direct access to `http://fivem_dashboard.test/api/` (same domain, no proxy needed)
- **Features**:
  - ⚡ Hot reloading (changes appear instantly)
  - 🐛 Better error messages and debugging
  - 📝 Source maps for easier debugging
  - 🔄 Automatic refresh on file changes
  - 🌐 Uses your Laragon custom domain

### Production Mode (`npm run build` + `npm run deploy`)

- **Purpose**: For live website deployment
- **URL**: `http://fivem_dashboard.test/` (Your Laragon custom domain)
- **Features**:
  - 📦 Minified and optimized code
  - 🚀 Faster loading times
  - 🔒 Production security optimizations

## 💻 Development Commands

```bash
# Start development server (recommended for coding)
npm run dev
# or
npm start

# The dev server will run on http://localhost:3000
# Your API will still work through http://fivem_dashboard.test/api/
```

## 🌐 Production Deployment Commands

```bash
# Build and deploy in one command (recommended)
npm run deploy

# Or step by step:
npm run build          # Create production build
npm run deploy:windows  # Copy to live webspace (Windows)

# Clean build directory
npm run clean
```

## 🔧 Development Setup

### 1. Start Development Server
```bash
npm run dev
```
- Opens `http://localhost:3000`
- React app runs in development mode
- Hot reloading enabled

### 2. API Configuration

Your API endpoints work through Laragon's custom domain:

- `http://fivem_dashboard.test/api/login_handler.php`
- `http://fivem_dashboard.test/api/register_handler.php`
- etc.

The React dev server automatically proxies API calls to your Laragon server.

### 3. Database Management
```bash
cd api
php setup_db.php    # Setup database
php test_db.php     # Test connection
```

## 🎯 Typical Development Flow

1. **Start Development**: `npm run dev`
2. **Code Changes**: Edit files in `src/`
3. **Test Locally**: View changes at `http://localhost:3000`
4. **Build for Production**: `npm run build`
5. **Deploy to Live**: `npm run deploy`
6. **Test Live**: Check `http://fivem_dashboard.test/`

## 🔍 Debugging

### Development Issues:
- Check console at `http://fivem_dashboard.test:3000`
- Use React Developer Tools
- Check browser network tab for API calls

### Production Issues:
- Check `http://fivem_dashboard.test/`
- Verify build files are copied correctly
- Check Laragon error logs

## 📁 File Structure

```
src/                 # Development source code
├── components/      # React components
├── pages/          # Page components
├── hooks/          # Custom React hooks
└── services/       # API services

build/              # Production build (auto-generated)
├── static/         # Minified JS/CSS
└── index.html      # Production HTML

api/                # PHP backend (served by Laragon)
├── config/         # Database configuration
├── auth/           # Authentication endpoints
└── fivem/          # FiveM-specific APIs
```

## 🚨 Important Notes

- **Never edit files in `build/` directory** - they get overwritten
- **Always use `npm run dev` for development** - much faster iteration
- **Use `npm run deploy` before sharing** - ensures optimized production code
- **API calls work in both modes** - they always go to your Laragon server

## 🎮 Quick Commands Reference

```bash
# Development (daily use)
npm run dev              # Start development server

# Production (when ready to deploy)
npm run deploy           # Build and deploy to live

# Maintenance
npm run clean            # Clean build directory
npm run lint             # Check code quality
npm run format           # Format code
```

---

**Happy coding!** 🎉 Use `npm run dev` for development and `npm run deploy` when you're ready to go live!
