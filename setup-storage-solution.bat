@echo off
echo.
echo ========================================
echo   📦 STORAGE SOLUTION SETUP
echo   Hybrid Multi-Tier Storage System
echo ========================================
echo.

echo 🔍 Checking current system...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found! Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js detected
echo.

echo 📦 Installing required dependencies...
call npm install googleapis
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

echo ⚙️ Configuring storage strategy...
call node dslr-config-tool.js set STORAGE.STRATEGY "hybrid"
call node dslr-config-tool.js set STORAGE.EXTERNAL.PROVIDER "google-drive"
call node dslr-config-tool.js set STORAGE.SUPABASE.MAX_SIZE_GB 0.8

echo ✅ Storage configuration updated
echo.

echo 🧪 Testing storage setup...
call node storage-optimization-cli.js test

echo.
echo ========================================
echo   🎯 SETUP COMPLETED!
echo ========================================
echo.
echo Next steps:
echo 1. Setup Google Drive API credentials
echo 2. Run: node storage-optimization-cli.js auth
echo 3. Test upload: node storage-optimization-cli.js test
echo 4. Start system: start-dslr-hybrid.bat
echo.
echo 📖 Full guide: STORAGE_SOLUTION_GUIDE.md
echo.
pause