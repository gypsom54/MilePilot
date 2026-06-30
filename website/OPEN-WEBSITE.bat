@echo off
title MilePilot Website v1.2
cd /d "%~dp0"
echo.
echo ========================================
echo   MilePilot Website v1.2
echo ========================================
echo.
type VERSION.txt
echo.
findstr /C:"Drive • Track • Claim" index.html >nul
if errorlevel 1 (
  echo ERROR: This folder does not have v1.2 branding.
  echo Download MilePilot-WEBSITE-v1.2-DOWNLOAD.zip from GitHub.
  pause
  exit /b 1
)
echo OK: v1.2 branding found. Opening in your browser...
echo.
start "" "%~dp0index.html"
