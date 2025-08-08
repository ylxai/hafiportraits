@echo off
echo.
echo ========================================
echo   📁 DSLR AUTO UPLOAD FILE ORGANIZER
echo   Merapikan file untuk kemudahan akses
echo ========================================
echo.

echo 🔍 Creating organized folder structure...

REM Create main folders
if not exist "DSLR-System" mkdir "DSLR-System"
if not exist "DSLR-System\Core" mkdir "DSLR-System\Core"
if not exist "DSLR-System\Config" mkdir "DSLR-System\Config"
if not exist "DSLR-System\Storage" mkdir "DSLR-System\Storage"
if not exist "DSLR-System\Testing" mkdir "DSLR-System\Testing"
if not exist "DSLR-System\Backup" mkdir "DSLR-System\Backup"
if not exist "DSLR-System\Logs" mkdir "DSLR-System\Logs"

echo ✅ Folder structure created

echo.
echo 📋 Copying core files...

REM Copy core files
copy "start-dslr-hybrid.bat" "DSLR-System\Core\" >nul 2>&1
copy "dslr-auto-upload-service.js" "DSLR-System\Core\" >nul 2>&1
copy "dslr-hybrid-cli.js" "DSLR-System\Core\" >nul 2>&1

REM Copy config files
copy ".env.local" "DSLR-System\Config\" >nul 2>&1
copy "dslr.config.js" "DSLR-System\Config\" >nul 2>&1
copy "dslr-current-event.json" "DSLR-System\Config\" >nul 2>&1
copy "dslr-events.json" "DSLR-System\Config\" >nul 2>&1

REM Copy storage files
copy "storage-optimization-cli.js" "DSLR-System\Storage\" >nul 2>&1
copy "check-r2-bucket-contents.js" "DSLR-System\Storage\" >nul 2>&1

REM Copy testing files
copy "test-cloudflare-r2-connection.js" "DSLR-System\Testing\" >nul 2>&1
copy "debug-tier-selection.js" "DSLR-System\Testing\" >nul 2>&1

REM Copy backup folder
if exist "dslr-backup" xcopy "dslr-backup" "DSLR-System\Backup\dslr-backup\" /E /I /Q >nul 2>&1

echo ✅ Files copied

echo.
echo 📝 Creating quick access shortcuts...

REM Create quick access batch files
echo @echo off > "DSLR-System\START-DSLR-SYSTEM.bat"
echo cd /d "%%~dp0Core" >> "DSLR-System\START-DSLR-SYSTEM.bat"
echo start-dslr-hybrid.bat >> "DSLR-System\START-DSLR-SYSTEM.bat"

echo @echo off > "DSLR-System\MANAGE-EVENTS.bat"
echo cd /d "%%~dp0Core" >> "DSLR-System\MANAGE-EVENTS.bat"
echo node dslr-hybrid-cli.js list >> "DSLR-System\MANAGE-EVENTS.bat"
echo pause >> "DSLR-System\MANAGE-EVENTS.bat"

echo @echo off > "DSLR-System\CHECK-STORAGE.bat"
echo cd /d "%%~dp0Storage" >> "DSLR-System\CHECK-STORAGE.bat"
echo node storage-optimization-cli.js status >> "DSLR-System\CHECK-STORAGE.bat"
echo pause >> "DSLR-System\CHECK-STORAGE.bat"

echo @echo off > "DSLR-System\TEST-SYSTEM.bat"
echo cd /d "%%~dp0Storage" >> "DSLR-System\TEST-SYSTEM.bat"
echo node storage-optimization-cli.js test >> "DSLR-System\TEST-SYSTEM.bat"
echo pause >> "DSLR-System\TEST-SYSTEM.bat"

echo ✅ Quick access shortcuts created

echo.
echo 📋 Creating README file...

echo # 🚀 DSLR Auto Upload System > "DSLR-System\README.md"
echo. >> "DSLR-System\README.md"
echo ## 📁 Folder Structure: >> "DSLR-System\README.md"
echo - **Core/**: File utama sistem >> "DSLR-System\README.md"
echo - **Config/**: Konfigurasi dan credentials >> "DSLR-System\README.md"
echo - **Storage/**: Management storage >> "DSLR-System\README.md"
echo - **Testing/**: Tools untuk testing >> "DSLR-System\README.md"
echo - **Backup/**: Local backup photos >> "DSLR-System\README.md"
echo - **Logs/**: Log files >> "DSLR-System\README.md"
echo. >> "DSLR-System\README.md"
echo ## 🚀 Quick Start: >> "DSLR-System\README.md"
echo 1. Double-click **START-DSLR-SYSTEM.bat** >> "DSLR-System\README.md"
echo 2. Use **MANAGE-EVENTS.bat** untuk kelola event >> "DSLR-System\README.md"
echo 3. Use **CHECK-STORAGE.bat** untuk monitor storage >> "DSLR-System\README.md"
echo 4. Use **TEST-SYSTEM.bat** untuk test sistem >> "DSLR-System\README.md"
echo. >> "DSLR-System\README.md"
echo ## 💾 Storage Capacity: >> "DSLR-System\README.md"
echo - Cloudflare R2: 10GB >> "DSLR-System\README.md"
echo - Google Drive: 2TB+ >> "DSLR-System\README.md"
echo - Local Backup: 50GB+ >> "DSLR-System\README.md"
echo - **TOTAL: 2.1TB+ storage!** >> "DSLR-System\README.md"

echo ✅ README created

echo.
echo ========================================
echo   🎉 FILE ORGANIZATION COMPLETED!
echo ========================================
echo.
echo 📁 Organized structure created in: DSLR-System\
echo.
echo 🚀 Quick Access Commands:
echo   START-DSLR-SYSTEM.bat     - Start complete system
echo   MANAGE-EVENTS.bat         - Manage photography events  
echo   CHECK-STORAGE.bat         - Check storage status
echo   TEST-SYSTEM.bat           - Test all systems
echo.
echo 📖 Read: DSLR-System\README.md for complete guide
echo.
echo ✅ Your DSLR auto upload system is now organized!
echo.
pause