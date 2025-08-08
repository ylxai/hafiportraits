@echo off
echo.
echo ========================================
echo   ☁️ CLOUDFLARE R2 SETUP WIZARD
echo   10GB Free Storage Setup
echo ========================================
echo.

echo 🔍 Checking system requirements...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found! Please install Node.js first.
    echo 💡 Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected
echo.

echo 📦 Installing Cloudflare R2 dependencies...
call npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

echo 📋 Creating environment template...
if not exist ".env.local" (
    echo # Cloudflare R2 Configuration > .env.local
    echo CLOUDFLARE_R2_ACCOUNT_ID="your-account-id" >> .env.local
    echo CLOUDFLARE_R2_ACCESS_KEY_ID="your-access-key-id" >> .env.local
    echo CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-secret-access-key" >> .env.local
    echo CLOUDFLARE_R2_BUCKET_NAME="hafiportrait-photos" >> .env.local
    echo.
    echo ✅ Environment template created: .env.local
) else (
    echo ⚠️ .env.local already exists
)

echo.
echo ========================================
echo   📖 SETUP INSTRUCTIONS
echo ========================================
echo.
echo 🎯 NEXT STEPS:
echo.
echo 1. 🌐 Open Cloudflare Dashboard:
echo    https://dash.cloudflare.com/sign-up
echo.
echo 2. 📁 Create R2 bucket:
echo    - Go to R2 Object Storage
echo    - Create bucket: hafiportrait-photos
echo.
echo 3. 🔑 Generate API credentials:
echo    - Go to Manage R2 API tokens
echo    - Create token with R2:Edit permissions
echo    - Copy Account ID, Access Key, Secret Key
echo.
echo 4. ⚙️ Update .env.local with your credentials
echo.
echo 5. 🧪 Test connection:
echo    node test-cloudflare-r2-connection.js
echo.
echo 📖 Detailed guide: CLOUDFLARE_R2_SETUP_STEP_BY_STEP.md
echo.
echo ========================================
echo   🎉 SETUP WIZARD COMPLETED!
echo ========================================
echo.
pause