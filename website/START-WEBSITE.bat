@echo off
title MilePilot Website v4.4
cd /d "%~dp0"
echo.
type VERSION.txt
echo.
findstr /C:"milepilot-theme.css" index.html >nul
if errorlevel 1 (
  echo ERROR: Download MilePilot-WEBSITE-v4.4-DOWNLOAD.zip from GitHub.
  pause
  exit /b 1
)
start http://localhost:3000
npx --yes serve -p 3000
