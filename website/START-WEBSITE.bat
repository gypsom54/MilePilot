@echo off
title MilePilot Website v1.1
cd /d "%~dp0"
echo.
echo ========================================
echo   MilePilot Website - local preview
echo ========================================
echo.
type VERSION.txt
echo.
findstr /C:"Join the beta" index.html >nul
if errorlevel 1 (
  echo ERROR: This folder has the OLD website.
  echo Download MilePilot-WEBSITE-v1.1-DOWNLOAD.zip from GitHub.
  pause
  exit /b 1
)
echo OK: New website files found.
echo.
echo Starting server at http://localhost:3000
echo Press Ctrl+C to stop.
echo.
start http://localhost:3000
npx --yes serve -p 3000
