@echo off
title MilePilot Website v3.0
cd /d "%~dp0"
echo.
echo ========================================
echo   MilePilot Website v3.0
echo ========================================
echo.
type VERSION.txt
echo.
findstr /C:"The Self-Employed" index.html >nul
if errorlevel 1 (
  echo ERROR: This folder does not have v3.0 branding.
  echo Download MilePilot-WEBSITE-v3.0-DOWNLOAD.zip from GitHub.
  pause
  exit /b 1
)
echo OK: v3.0 brand site found. Opening in your browser...
echo.
start "" "%~dp0index.html"
