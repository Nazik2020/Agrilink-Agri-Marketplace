@echo off
echo Starting PHP Development Server for Agrilink Backend...
echo.
echo Server will be available at: http://localhost:8080
echo Backend APIs will be at: http://localhost:8080/backend/
echo Order History API: http://localhost:8080/backend/order_history/
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"
php -S localhost:8080

pause
