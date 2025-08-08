#!/bin/bash

echo ""
echo "========================================"
echo "  📁 DSLR AUTO UPLOAD FILE ORGANIZER"
echo "  Merapikan file untuk kemudahan akses"
echo "========================================"
echo ""

echo "🔍 Creating organized folder structure..."

# Create main folders
mkdir -p "DSLR-System/Core"
mkdir -p "DSLR-System/Config"
mkdir -p "DSLR-System/Storage"
mkdir -p "DSLR-System/Testing"
mkdir -p "DSLR-System/Backup"
mkdir -p "DSLR-System/Logs"

echo "✅ Folder structure created"
echo ""
echo "📋 Copying core files..."

# Copy core files
cp "start-dslr-hybrid.bat" "DSLR-System/Core/" 2>/dev/null || echo "⚠️ start-dslr-hybrid.bat not found"
cp "dslr-auto-upload-service.js" "DSLR-System/Core/" 2>/dev/null || echo "⚠️ dslr-auto-upload-service.js not found"
cp "dslr-hybrid-cli.js" "DSLR-System/Core/" 2>/dev/null || echo "⚠️ dslr-hybrid-cli.js not found"

# Copy config files
cp ".env.local" "DSLR-System/Config/" 2>/dev/null || echo "⚠️ .env.local not found"
cp "dslr.config.js" "DSLR-System/Config/" 2>/dev/null || echo "⚠️ dslr.config.js not found"
cp "dslr-current-event.json" "DSLR-System/Config/" 2>/dev/null || echo "⚠️ dslr-current-event.json not found"
cp "dslr-events.json" "DSLR-System/Config/" 2>/dev/null || echo "⚠️ dslr-events.json not found"

# Copy storage files
cp "storage-optimization-cli.js" "DSLR-System/Storage/" 2>/dev/null || echo "⚠️ storage-optimization-cli.js not found"
cp "check-r2-bucket-contents.js" "DSLR-System/Storage/" 2>/dev/null || echo "⚠️ check-r2-bucket-contents.js not found"

# Copy testing files
cp "test-cloudflare-r2-connection.js" "DSLR-System/Testing/" 2>/dev/null || echo "⚠️ test-cloudflare-r2-connection.js not found"
cp "debug-tier-selection.js" "DSLR-System/Testing/" 2>/dev/null || echo "⚠️ debug-tier-selection.js not found"

# Copy backup folder
if [ -d "dslr-backup" ]; then
    cp -r "dslr-backup" "DSLR-System/Backup/"
    echo "✅ Backup folder copied"
else
    echo "⚠️ dslr-backup folder not found"
fi

echo "✅ Files copied"
echo ""
echo "📝 Creating quick access scripts..."

# Create quick access scripts
cat > "DSLR-System/start-system.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/Core"
if [ -f "start-dslr-hybrid.bat" ]; then
    echo "Starting DSLR system..."
    node dslr-auto-upload-service.js
else
    echo "❌ start-dslr-hybrid.bat not found"
fi
EOF

cat > "DSLR-System/manage-events.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/Core"
if [ -f "dslr-hybrid-cli.js" ]; then
    echo "📋 Event Management:"
    node dslr-hybrid-cli.js list
else
    echo "❌ dslr-hybrid-cli.js not found"
fi
read -p "Press Enter to continue..."
EOF

cat > "DSLR-System/check-storage.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/Storage"
if [ -f "storage-optimization-cli.js" ]; then
    echo "📊 Storage Status:"
    node storage-optimization-cli.js status
else
    echo "❌ storage-optimization-cli.js not found"
fi
read -p "Press Enter to continue..."
EOF

cat > "DSLR-System/test-system.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/Storage"
if [ -f "storage-optimization-cli.js" ]; then
    echo "🧪 System Test:"
    node storage-optimization-cli.js test
else
    echo "❌ storage-optimization-cli.js not found"
fi
read -p "Press Enter to continue..."
EOF

# Make scripts executable
chmod +x "DSLR-System/start-system.sh"
chmod +x "DSLR-System/manage-events.sh"
chmod +x "DSLR-System/check-storage.sh"
chmod +x "DSLR-System/test-system.sh"

echo "✅ Quick access scripts created"
echo ""
echo "📋 Creating README file..."

cat > "DSLR-System/README.md" << 'EOF'
# 🚀 DSLR Auto Upload System

## 📁 Folder Structure:
- **Core/**: File utama sistem
- **Config/**: Konfigurasi dan credentials
- **Storage/**: Management storage
- **Testing/**: Tools untuk testing
- **Backup/**: Local backup photos
- **Logs/**: Log files

## 🚀 Quick Start:
1. Run `./start-system.sh` untuk start sistem
2. Run `./manage-events.sh` untuk kelola event
3. Run `./check-storage.sh` untuk monitor storage
4. Run `./test-system.sh` untuk test sistem

## 💾 Storage Capacity:
- Cloudflare R2: 10GB
- Google Drive: 2TB+
- Local Backup: 50GB+
- **TOTAL: 2.1TB+ storage!**

## 📋 Core Commands:
```bash
# Event Management
cd Core && node dslr-hybrid-cli.js list
cd Core && node dslr-hybrid-cli.js quick "Event Name" 2025-01-15

# Storage Management
cd Storage && node storage-optimization-cli.js test
cd Storage && node storage-optimization-cli.js status

# System Testing
cd Testing && node test-cloudflare-r2-connection.js
cd Testing && node debug-tier-selection.js
```

## 🎯 Production Workflow:
1. Create event: `node dslr-hybrid-cli.js quick "Wedding Name" 2025-01-15`
2. Start system: `./start-system.sh`
3. Connect DSLR camera
4. Photos auto-upload to cloud storage
5. Monitor: `./check-storage.sh`
EOF

echo "✅ README created"
echo ""
echo "========================================"
echo "  🎉 FILE ORGANIZATION COMPLETED!"
echo "========================================"
echo ""
echo "📁 Organized structure created in: DSLR-System/"
echo ""
echo "🚀 Quick Access Commands:"
echo "  ./start-system.sh         - Start complete system"
echo "  ./manage-events.sh        - Manage photography events"
echo "  ./check-storage.sh        - Check storage status"
echo "  ./test-system.sh          - Test all systems"
echo ""
echo "📖 Read: DSLR-System/README.md for complete guide"
echo ""
echo "✅ Your DSLR auto upload system is now organized!"
echo ""