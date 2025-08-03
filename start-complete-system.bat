@echo off
title DSLR Photo System - Complete Startup
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🚀 DSLR Photo System                     ║
echo ║                     Complete Startup                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Check Node.js
echo 🔍 Checking system requirements...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)
echo ✅ Node.js found

REM Check if port 3000 is available
echo 🔍 Checking if port 3000 is available...
netstat -an | find "3000" | find "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo ⚠️ Port 3000 is already in use
    echo 🔄 Trying to connect to existing service...
    timeout /t 2 >nul
    curl -s http://localhost:3000/api/test/db >nul 2>&1
    if not errorlevel 1 (
        echo ✅ Next.js app already running
        goto start_dslr
    ) else (
        echo ❌ Port 3000 occupied by another service
        echo 💡 Please stop the service using port 3000 or change the port
        pause
        exit /b 1
    )
)

echo 🚀 Starting Next.js application...
echo 📝 Opening new terminal for web app...

REM Start Next.js in new window
start "Next.js Web App" cmd /k "echo 🌐 Starting Next.js Web Application... && npm run dev"

echo ⏳ Waiting for Next.js to start...
:wait_for_nextjs
timeout /t 3 >nul
curl -s http://localhost:3000/api/test/db >nul 2>&1
if errorlevel 1 (
    echo 🔄 Still waiting for Next.js...
    goto wait_for_nextjs
)

echo ✅ Next.js application is ready!

:start_dslr
echo.
echo 🚀 Starting DSLR Auto Upload Service...
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    📸 DSLR Configuration                    ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║ 📁 Watch Folder: C:/DCIM/100NIKON                          ║
echo ║ 🌐 API URL: http://localhost:3000                          ║
echo ║ 📸 Event ID: your-event-id                                 ║
echo ║ 👨‍💼 Photographer: Official Photographer                    ║
echo ║ 💾 Backup Folder: ./dslr-backup                            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 💡 Tips:
echo    • Make sure your Nikon D7100 is connected via USB
echo    • Photos will be auto-uploaded when detected
echo    • Check the web dashboard at http://localhost:3000/admin
echo    • Press Ctrl+C to stop the DSLR service
echo.
echo 🔄 Starting DSLR service in 3 seconds...
timeout /t 3 >nul

node dslr-auto-upload-service.js

echo.
echo 👋 DSLR service stopped.
echo 💡 The web application is still running in the other window.
echo 🌐 Access it at: http://localhost:3000
pause