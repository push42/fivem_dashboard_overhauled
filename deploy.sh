#!/bin/bash
# FiveM Dashboard Deployment Script
# Run this after npm run build to deploy to production

echo "🚀 Deploying FiveM Dashboard..."

# Copy built files to root directory
echo "📦 Copying built files..."
cp -r build/* .

echo "✅ Deployment complete!"
echo "🌐 Your dashboard is now available at: http://fivem_dashboard.test/"
echo "💡 Use 'npm run dev' for development mode at http://localhost:3000"

# Optional: Clean up build directory to save space
# rm -rf build/

echo "💡 Tip: Run 'npm run build && ./deploy.sh' to build and deploy in one command"
