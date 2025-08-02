@echo off
echo ========================================
echo   QUICK SERVER STATUS CHECK
echo ========================================
echo.

echo Testing PHP Server...
curl -s http://localhost:8080/backend/test_server.php > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PHP Server: RUNNING on localhost:8080
) else (
    echo ❌ PHP Server: NOT RUNNING
    echo.
    echo TO FIX: Open terminal and run:
    echo cd "d:\Documents\GitHub\Agrilink-Agri-Marketplace\backend"
    echo php -S localhost:8080
)

echo.
echo Testing React Server...
curl -s http://localhost:3000 > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ React Server: RUNNING on localhost:3000
) else (
    echo ❌ React Server: NOT RUNNING
    echo.
    echo TO FIX: Open terminal and run:
    echo cd "d:\Documents\GitHub\Agrilink-Agri-Marketplace"
    echo npm run dev
)

echo.
echo ========================================
pause
