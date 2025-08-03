@echo off
echo 🚀 Starting DSLR Auto Upload Service...
echo.
echo Make sure:
echo - Nikon D7100 is connected via USB
echo - Camera Control Pro 2 is installed
echo - Auto-save folder is set to C:/DCIM/100NIKON
echo.
pause
echo.
echo Starting service...
node dslr-auto-upload-service.js
pause