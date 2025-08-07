@echo off
title DSLR Auto Upload - Event Manager Integration
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                🎯 DSLR Auto Upload Service                  ║
echo ║                  Event Manager Integration                   ║
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

echo.
echo 📋 Checking current event status...
node dslr-event-manager.js current >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ No active event found!
    echo.
    echo 💡 Available options:
    echo    1. List existing events
    echo    2. Create new event
    echo    3. Quick setup new event
    echo    4. Exit
    echo.
    set /p choice="Choose option (1-4): "
    
    if "%choice%"=="1" (
        echo.
        echo 📋 Available events:
        node dslr-event-manager.js list
        echo.
        echo 💡 To activate an event:
        echo    node dslr-event-manager.js activate ^<event-id^>
        pause
        exit /b 1
    )
    
    if "%choice%"=="2" (
        echo.
        set /p eventName="Enter event name: "
        set /p eventDate="Enter event date (YYYY-MM-DD): "
        set /p photographer="Enter photographer name (or press Enter for 'Official Photographer'): "
        if "%photographer%"=="" set photographer=Official Photographer
        
        echo.
        echo 🚀 Creating event...
        node dslr-event-manager.js create "%eventName%" "%eventDate%" "%photographer%"
        
        echo.
        echo 💡 Now activate the event:
        echo    node dslr-event-manager.js activate ^<event-id^>
        pause
        exit /b 1
    )
    
    if "%choice%"=="3" (
        echo.
        set /p eventName="Enter event name: "
        set /p eventDate="Enter event date (YYYY-MM-DD): "
        
        echo.
        echo 🚀 Quick setup...
        node dslr-event-manager.js quick "%eventName%" "%eventDate%"
        
        echo.
        echo ✅ Event created and activated!
        echo 🔄 Continuing to start DSLR service...
        timeout /t 3 >nul
    ) else (
        exit /b 1
    )
) else (
    echo ✅ Active event found
    echo.
    echo 📸 Current Event Details:
    node dslr-event-manager.js current
)

echo.
echo 🚀 Starting DSLR Auto Upload Service...
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    📸 Service Information                    ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║ 📁 Camera Folder: Auto-detected                            ║
echo ║ 🌐 Web Dashboard: http://localhost:3000/admin              ║
echo ║ 📊 Event Management: Dynamic (no env changes needed)       ║
echo ║ 🏷️ Watermark: Per-event configuration                      ║
echo ║ 💾 Backup: Per-event configuration                         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 💡 Tips:
echo    • Event configuration is loaded automatically
echo    • No need to change environment variables
echo    • Switch events with: node dslr-event-manager.js activate ^<event-id^>
echo    • Check status with: node dslr-event-manager.js current
echo.
echo 🔄 Starting service in 3 seconds...
timeout /t 3 >nul

node dslr-auto-upload-service.js

echo.
echo 👋 DSLR service stopped.
pause