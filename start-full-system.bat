@echo off
echo 🎉 Starting Complete DSLR + Notification System
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting Web Application...
start cmd /k "npm run dev"
echo.
echo Waiting 10 seconds for web app to start...
timeout /t 10 /nobreak > nul
echo.
echo Starting DSLR Service...
start cmd /k "node dslr-auto-upload-service.js"
echo.
echo ✅ System started!
echo.
echo Web App: http://localhost:3000
echo DSLR Service: Running in separate window
echo.
echo Connect your Nikon D7100 and start shooting!
pause