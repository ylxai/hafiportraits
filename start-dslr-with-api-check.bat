@echo off
echo 🚀 Starting DSLR System with API Check...
echo.

REM Check if Node.js is available
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js found

REM Check if Next.js app is running
echo 🔍 Checking if Next.js app is running...
curl -s http://localhost:3000/api/test/db >nul 2>&1
if errorlevel 1 (
    echo ⚠️ Next.js app not running. Starting it first...
    echo.
    echo 📝 Please run this command in another terminal:
    echo    npm run dev
    echo.
    echo 🔄 DSLR service will run in standalone mode (local logging only)
    echo.
    pause
) else (
    echo ✅ Next.js app is running
    echo.
)

echo 🚀 Starting DSLR Auto Upload Service...
echo.
echo 📋 Service Configuration:
echo    📁 Watch Folder: C:/DCIM/100NIKON
echo    🌐 API URL: http://localhost:3000
echo    📸 Event ID: your-event-id
echo    👨‍💼 Photographer: Official Photographer
echo.
echo 💡 Tips:
echo    - Make sure your Nikon D7100 is connected
echo    - Photos will be auto-uploaded when detected
echo    - Press Ctrl+C to stop the service
echo.

node dslr-auto-upload-service.js

echo.
echo 👋 DSLR service stopped.
pause