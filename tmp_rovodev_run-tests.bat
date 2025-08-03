@echo off
echo 🧪 DSLR NOTIFICATION SYSTEM - TEST SUITE
echo ========================================
echo.
echo Choose test to run:
echo.
echo 1. System Integration Test (Test all notifications)
echo 2. Photo Upload Simulation (Simulate real camera)
echo 3. API Endpoints Test (Test backend APIs)
echo 4. Complete Integration Test (All tests + end-to-end)
echo 5. Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto test1
if "%choice%"=="2" goto test2  
if "%choice%"=="3" goto test3
if "%choice%"=="4" goto test4
if "%choice%"=="5" goto exit
goto invalid

:test1
echo.
echo 🔔 Running System Integration Test...
echo ====================================
node tmp_rovodev_test-dslr-system.js
goto end

:test2
echo.
echo 📸 Running Photo Upload Simulation...
echo ====================================
node tmp_rovodev_test-photo-simulator.js
goto end

:test3
echo.
echo 🌐 Running API Endpoints Test...
echo ===============================
node tmp_rovodev_test-api-endpoints.js
goto end

:test4
echo.
echo 🚀 Running Complete Integration Test...
echo ======================================
node tmp_rovodev_test-complete-integration.js
goto end

:invalid
echo.
echo ❌ Invalid choice. Please enter 1, 2, 3, 4, or 5.
echo.
pause
goto start

:start
cls
echo 🧪 DSLR NOTIFICATION SYSTEM - TEST SUITE
echo ========================================
echo.
echo Choose test to run:
echo.
echo 1. System Integration Test (Test all notifications)
echo 2. Photo Upload Simulation (Simulate real camera)
echo 3. API Endpoints Test (Test backend APIs)
echo 4. Complete Integration Test (All tests + end-to-end)
echo 5. Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto test1
if "%choice%"=="2" goto test2  
if "%choice%"=="3" goto test3
if "%choice%"=="4" goto test4
if "%choice%"=="5" goto exit
goto invalid

:end
echo.
echo ✅ Tests completed!
echo.
echo 💡 Next steps:
echo   - Check notification center in web app
echo   - Monitor DSLR service console logs  
echo   - Verify photos in admin dashboard
echo.
pause
goto exit

:exit