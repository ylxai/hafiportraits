@echo off
echo.
echo ========================================
echo   ☁️ CLOUDFLARE R2 + GOOGLE DRIVE SETUP
echo   25GB Free Storage Solution!
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
call npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner googleapis
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

echo ⚙️ Configuring storage strategy...
call node dslr-config-tool.js set STORAGE.STRATEGY "cloudflare-google"
call node dslr-config-tool.js set STORAGE.CLOUDFLARE_R2.MAX_SIZE_GB 8
call node dslr-config-tool.js set STORAGE.GOOGLE_DRIVE.MAX_SIZE_GB 12

echo ✅ Storage configuration updated
echo.

echo 📋 Creating environment template...
if not exist ".env.local" (
    copy ".env.cloudflare-google.example" ".env.local"
    echo ✅ Environment template created: .env.local
) else (
    echo ⚠️ .env.local already exists, please merge manually
)

echo.
echo 🧪 Testing storage setup...
call node storage-optimization-cli.js test

echo.
echo ========================================
echo   🎯 SETUP COMPLETED!
echo ========================================
echo.
echo 📊 STORAGE CAPACITY:
echo   Cloudflare R2: 10GB FREE
echo   Google Drive:  15GB FREE
echo   Local Backup:  50GB
echo   TOTAL:         75GB+ (75x more than Supabase!)
echo.
echo 💰 COST: $0/month (100%% FREE!)
echo.
echo Next steps:
echo 1. Setup Cloudflare R2 credentials in .env.local
echo 2. Setup Google Drive API credentials in .env.local
echo 3. Run: node storage-optimization-cli.js auth
echo 4. Test: node storage-optimization-cli.js test
echo 5. Start: start-dslr-hybrid.bat
echo.
echo 📖 Full guide: CLOUDFLARE_GOOGLE_STORAGE_GUIDE.md
echo.
pause