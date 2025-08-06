#!/bin/bash

echo "🚀 Starting Hafi Portrait in Production Mode..."

# Stop development server if running
echo "📛 Stopping development server..."
pkill -f "next dev" || echo "No dev server running"

# Set production environment
export NODE_ENV=production

# Build the application
echo "🏗️ Building application for production..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Start production server
    echo "🚀 Starting production server on port 3000..."
    echo "📱 Access your app at: http://$(curl -s ifconfig.me):3000"
    echo "🔧 Admin dashboard: http://$(curl -s ifconfig.me):3000/admin"
    echo ""
    echo "🛑 To stop: Press Ctrl+C"
    echo "🔄 To restart: ./start-production.sh"
    echo ""
    
    # Start with production environment
    npm start
else
    echo "❌ Build failed! Check the errors above."
    exit 1
fi