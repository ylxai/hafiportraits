@echo off
echo ========================================
echo 🧪 EVENT CRUD TEST RUNNER
echo ========================================
echo.

echo 📋 Testing Event CRUD Operations...
echo.

echo 1. Starting Next.js development server...
start "Next.js Server" cmd /c "npm run dev"

echo.
echo 2. Waiting for server to start (10 seconds)...
timeout /t 10 /nobreak > nul

echo.
echo 3. Running Event CRUD tests...
node tmp_rovodev_test-event-crud.js

echo.
echo 4. Test completed! Check the output above.
echo.

echo 📱 You can also test manually:
echo    1. Open http://localhost:3000/admin
echo    2. Go to Content ^> Events tab
echo    3. Try creating, editing, and deleting events
echo.

pause