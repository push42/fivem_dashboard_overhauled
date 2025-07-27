# 🌐 CORS Configuration Guide

## ✅ CORS Issues Fixed!

### 🔧 **Problem Solved:**
The CORS (Cross-Origin Resource Sharing) error occurred because:
- React dev server runs on `http://localhost:3000`
- API server runs on `http://fivem_dashboard.test`
- When using `withCredentials: true` (for session cookies), the server cannot use wildcard `*` for `Access-Control-Allow-Origin`

### 🛠️ **Solution Implemented:**

1. **Created CORS Helper** (`api/cors_helper.php`):
   - Handles both development (`localhost:3000`) and production (`fivem_dashboard.test`) origins
   - Sets appropriate headers based on request origin
   - Handles preflight OPTIONS requests automatically

2. **Updated All API Endpoints** to use the CORS helper:
   - `login_handler.php`
   - `register_handler.php`
   - `check-auth.php`
   - `logout.php`
   - `get_server_status.php`

### 🌐 **Supported Origins:**
- `http://localhost:3000` (Development server)
- `http://fivem_dashboard.test` (Production domain)
- `https://fivem_dashboard.test` (SSL production domain)

### 🔍 **CORS Headers Set:**
```
Access-Control-Allow-Origin: [specific origin]
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Requested-With, Authorization
Access-Control-Allow-Credentials: true
```

### 🎯 **Testing:**
```bash
# Test CORS preflight
curl -X OPTIONS http://fivem_dashboard.test/api/login_handler.php \
  -H "Origin: http://localhost:3000" -v

# Should return 200 OK with proper CORS headers
```

### 🚀 **Development Workflow:**
1. **Development**: `npm run dev` at `http://localhost:3000`
2. **Production**: `npm run deploy` at `http://fivem_dashboard.test`
3. **Both work seamlessly** with proper CORS handling

### 💡 **Future API Endpoints:**
When creating new API endpoints, add this at the top:
```php
<?php
require_once 'cors_helper.php'; // Adjust path as needed
initCors(); // This handles all CORS requirements
```

Your authentication system now works perfectly in both development and production! 🎉
