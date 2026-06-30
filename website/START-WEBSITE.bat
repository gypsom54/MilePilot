@echo off
title MilePilot Website v1.3
cd /d "%~dp0"
echo.
echo ========================================
echo   MilePilot Website - local preview
echo ========================================
echo.
type VERSION.txt
echo.
findstr /C:"On AutoPilot." index.html >nul
if errorlevel 1 (
  echo ERROR: This folder does not have v1.3 branding.
  echo Download MilePilot-WEBSITE-v1.3-DOWNLOAD.zip from GitHub.
  pause
  exit /b 1
)
echo OK: v1.3 product experience found.
echo.
echo Starting server at http://localhost:3000
echo Press Ctrl+C to stop.
echo.
start http://localhost:3000
npx --yes serve -p 3000
