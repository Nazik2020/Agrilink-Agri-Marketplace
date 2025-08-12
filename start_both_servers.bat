@echo off
echo =======================================
echo    AGRILINK - START BOTH SERVERS
echo =======================================
echo.

echo Starting React Development Server...
start "React Dev Server" cmd /k "cd /d d:\Documents\GitHub\Agrilink-Agri-Marketplace && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting PHP Backend Server...
start "PHP Backend Server" cmd /k "cd /d d:\Documents\GitHub\Agrilink-Agri-Marketplace\backend && php -S localhost:8080"

echo.
echo Both servers are starting...
echo React: http://localhost:3000
echo PHP:   http://localhost:8080
echo.
echo Press any key to close this window...
pause > nul
