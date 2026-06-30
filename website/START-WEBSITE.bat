@echo off
title MilePilot Website v4.5
cd /d "%~dp0"
echo.
type VERSION.txt
echo.
findstr /C:"milepilot-theme.css" index.html >nul
if errorlevel 1 (
  echo ERROR: Download MilePilot-WEBSITE-v4.5-DOWNLOAD.zip from GitHub.
  pause
  exit /b 1
)
start "" "%~dp0index.html"
