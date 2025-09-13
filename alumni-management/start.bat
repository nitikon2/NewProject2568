@echo off
echo ========================================
echo   Alumni Management System Launcher
echo ========================================
echo.

REM เช็คว่า MySQL ทำงานอยู่หรือไม่
echo [1/4] Checking MySQL service...
sc query MySQL > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MySQL service not found or not running
    echo Please start MySQL service first
    pause
    exit /b 1
)
echo ✅ MySQL service is running

REM เช็คว่า Node.js พร้อมใช้งานหรือไม่
echo.
echo [2/4] Checking Node.js...
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found
    echo Please install Node.js first
    pause
    exit /b 1
)
echo ✅ Node.js is available

REM เริ่ม Backend Server
echo.
echo [3/4] Starting Backend Server...
cd /d "%~dp0backend"
start "Alumni Backend" cmd /k "echo Starting backend server... && node server.js"

REM รอ backend เริ่มต้น
echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

REM เริ่ม Frontend
echo.
echo [4/4] Starting Frontend...
cd /d "%~dp0frontend"
start "Alumni Frontend" cmd /k "echo Starting frontend... && npx react-scripts start"

echo.
echo ========================================
echo ✅ System is starting up!
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Wait a moment for both services to load...
echo ========================================
echo.
echo Press any key to exit this launcher...
pause > nul