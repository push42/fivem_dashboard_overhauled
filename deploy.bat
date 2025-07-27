@echo off
REM FiveM Dashboard Deployment Script for Windows
REM Run this after npm run build to deploy to production

echo 🚀 Deploying FiveM Dashboard...

REM Check if build directory exists
if not exist "build\" (
    echo ❌ Build directory not found! Run 'npm run build' first.
    pause
    exit /b 1
)

REM Copy built files to root directory
echo 📦 Copying built files...
xcopy /E /Y /Q build\* . >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ Deployment complete!
    echo 🌐 Your dashboard is now available at: http://fivem_dashboard.test/
    echo 💡 Use 'npm run dev' for development mode at http://localhost:3000
) else (
    echo ❌ Deployment failed!
    echo 💡 Try running as administrator or check file permissions
)

REM Optional: Clean up build directory to save space
REM rmdir /S /Q build

echo 💡 Tip: Run 'npm run build && deploy.bat' to build and deploy in one command
pause
