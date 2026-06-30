@echo off
title MilePilot Website v4.5
cd /d "%~dp0"
echo.
echo ========================================
  echo   MilePilot Website v4.5
echo ========================================
echo.
type VERSION.txt
echo.
findstr /C:"milepilot-theme.css" index.html >nul
if errorlevel 1 (
  echo ERROR: This folder does not have v4.5 branding.
  echo Download MilePilot-WEBSITE-v4.5-DOWNLOAD.zip from GitHub.
  pause
  exit /b 1
)
echo OK: v4.5 micro-polish found. Opening in your browser...
echo.
start "" "%~dp0index.html"
