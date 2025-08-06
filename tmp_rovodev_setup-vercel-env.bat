@echo off
REM 🔧 VERCEL ENVIRONMENT VARIABLES SETUP SCRIPT (Windows)
REM This script will help you set up all required environment variables for Vercel deployment

echo 🚀 VERCEL ENVIRONMENT VARIABLES SETUP
echo ======================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
    echo ✅ Vercel CLI installed!
    echo.
)

REM Login to Vercel
echo 🔐 Please login to Vercel...
vercel login
echo.

echo 📝 Setting up environment variables...
echo.

REM Core Application Variables
echo 1️⃣ Setting up CORE APPLICATION variables...

echo Setting NEXT_PUBLIC_SUPABASE_URL...
echo https://azspktldiblhrwebzmwq.supabase.co | vercel env add NEXT_PUBLIC_SUPABASE_URL

echo Setting NEXT_PUBLIC_SUPABASE_ANON_KEY...
echo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c3BrdGxkaWJsaHJ3ZWJ6bXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDQwNDQsImV4cCI6MjA2OTUyMDA0NH0.uKHB4K9hxUDTc0ZkwidCJv_Ev-oa99AflFvrFt_8MG8 | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

echo Setting SUPABASE_SERVICE_ROLE_KEY...
echo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c3BrdGxkaWJsaHJ3ZWJ6bXdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk0NDA0NCwiZXhwIjoyMDY5NTIwMDQ0fQ.hk8vOgFoW3PJZxhw40sHiNyvNxbD4_c4x6fqBynvlmE | vercel env add SUPABASE_SERVICE_ROLE_KEY

echo Setting JWT_SECRET...
echo hafiportrait-vercel-production-secret-key-2025 | vercel env add JWT_SECRET

echo Setting NODE_ENV...
echo production | vercel env add NODE_ENV

echo.
echo 2️⃣ Setting up DSLR SERVICE variables...

echo Setting DSLR_PERFORMANCE_PROFILE...
echo PRODUCTION | vercel env add DSLR_PERFORMANCE_PROFILE

echo Setting DSLR_NOTIFICATIONS_ENABLED...
echo true | vercel env add DSLR_NOTIFICATIONS_ENABLED

echo Setting DSLR_WATERMARK_ENABLED...
echo false | vercel env add DSLR_WATERMARK_ENABLED

echo Setting DSLR_ENABLE_AUTH...
echo true | vercel env add DSLR_ENABLE_AUTH

echo Setting DSLR_RATE_LIMIT_REQUESTS...
echo 100 | vercel env add DSLR_RATE_LIMIT_REQUESTS

echo Setting DSLR_RATE_LIMIT_WINDOW_MS...
echo 60000 | vercel env add DSLR_RATE_LIMIT_WINDOW_MS

echo.
echo ✅ Core environment variables set successfully!
echo.
echo 📋 NEXT STEPS:
echo 1. Deploy your project: vercel
echo 2. Get your Vercel URL from the deployment
echo 3. Set NEXT_PUBLIC_APP_URL and DSLR_API_BASE_URL with your actual Vercel URL
echo 4. Redeploy: vercel --prod
echo.
echo 🔗 After deployment, run these commands with your actual Vercel URL:
echo vercel env add NEXT_PUBLIC_APP_URL
echo vercel env add DSLR_API_BASE_URL
echo.
pause