#!/bin/bash

echo "🚀 Starting Hafi Portrait in Production Mode with HTTPS..."
echo "🌐 Domain: https://ipvhepiuwpol.ap-southeast-1.clawcloudrun.com"

# Stop development server if running
echo "📛 Stopping development server..."
pkill -f "next dev" || echo "No dev server running"

# Set production environment
export NODE_ENV=production
export NEXT_PUBLIC_APP_URL=https://hafiportrait.photography

# Build the application
echo "🏗️ Building application for production..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Start production server
    echo "🚀 Starting production server..."
    echo ""
    echo "🌐 Your app is now live at:"
    echo "   📱 Main Site: https://ipvhepiuwpol.ap-southeast-1.clawcloudrun.com"
    echo "   🔧 Admin Dashboard: https://ipvhepiuwpol.ap-southeast-1.clawcloudrun.com/admin"
    echo "   📊 API Health: https://ipvhepiuwpol.ap-southeast-1.clawcloudrun.com/api/test/db"
    echo ""
    echo "✅ HTTPS enabled - Secure connection!"
    echo "🛑 To stop: Press Ctrl+C"
    echo "🔄 To restart: ./start-production-https.sh"
    echo ""
    
    # Start with production environment
    npm start
else
    echo "❌ Build failed! Check the errors above."
    exit 1
fi