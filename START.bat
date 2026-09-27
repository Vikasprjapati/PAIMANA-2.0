@echo off
title PAIMANA AI - MoSPI Monitoring Command Centre
color 0A
cls
echo =====================================================================
echo    PAIMANA AI - Integrated Project Monitoring & AI Early Warning System
echo    Ministry of Statistics & Programme Implementation (MoSPI)
echo    SIH 2026 | Problem Statement SIH26103
echo =====================================================================
echo.
echo [1/3] Checking environment...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [2/3] Checking dependencies...
if not exist "node_modules" (
    echo Installing required packages...
    call npm install
)

echo [3/3] Launching PAIMANA AI Server...
echo.
echo Opening browser at http://localhost:5173 ...
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo =====================================================================
echo  SERVER ACTIVE: http://localhost:5173
echo  Press Ctrl+C to stop the server anytime.
echo =====================================================================
echo.

call npm run dev -- --host
pause
