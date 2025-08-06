#!/bin/bash

echo "🚀 Starting Hafi Portrait with PM2 (Production Mode)..."

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Stop any existing processes
echo "📛 Stopping existing processes..."
pm2 stop hafiportrait 2>/dev/null || echo "No existing process found"
pm2 delete hafiportrait 2>/dev/null || echo "No existing process to delete"

# Set production environment
export NODE_ENV=production

# Build the application
echo "🏗️ Building application for production..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Start with PM2
    echo "🚀 Starting with PM2..."
    pm2 start npm --name "hafiportrait" -- start
    
    # Save PM2 configuration
    pm2 save
    pm2 startup
    
    echo ""
    echo "✅ Production server started successfully!"
    echo "📱 Access your app at: http://$(curl -s ifconfig.me):3000"
    echo "🔧 Admin dashboard: http://$(curl -s ifconfig.me):3000/admin"
    echo ""
    echo "📊 PM2 Commands:"
    echo "   pm2 status           - Check status"
    echo "   pm2 logs hafiportrait - View logs"
    echo "   pm2 restart hafiportrait - Restart app"
    echo "   pm2 stop hafiportrait - Stop app"
    echo "   pm2 monit           - Monitor dashboard"
    
else
    echo "❌ Build failed! Check the errors above."
    exit 1
fi