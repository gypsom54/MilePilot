@echo off
title MilePilot Website v3.0
cd /d "%~dp0"
echo.
type VERSION.txt
echo.
findstr /C:"The Self-Employed" index.html >nul
if errorlevel 1 (
  echo ERROR: Download MilePilot-WEBSITE-v3.0-DOWNLOAD.zip from GitHub.
  pause
  exit /b 1
)
start http://localhost:3000
npx --yes serve -p 3000
