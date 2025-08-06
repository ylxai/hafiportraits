#!/bin/bash

echo "🔍 Verifying Auto-Startup Configuration..."

# Check PM2 startup status
echo "📊 PM2 Startup Status:"
pm2 startup

echo ""
echo "📋 Current PM2 Process List:"
pm2 list

echo ""
echo "💾 PM2 Saved Configuration:"
ls -la ~/.pm2/dump.pm2

echo ""
echo "🔧 Systemd Service Status:"
sudo systemctl status pm2-devbox 2>/dev/null || echo "Service not yet active (normal if just configured)"

echo ""
echo "✅ Auto-startup verification complete!"
echo ""
echo "🧪 To test auto-startup:"
echo "   1. sudo reboot (restart server)"
echo "   2. Wait 2-3 minutes"
echo "   3. Check: pm2 status"
echo "   4. Verify: https://ipvhepiuwpol.ap-southeast-1.clawcloudrun.com"