@echo off
setlocal EnableExtensions
title MilePilot Website
cd /d "%~dp0"

echo.
echo ========================================
echo   MilePilot Website
echo ========================================
echo.

if not exist "%~dp0index.html" (
  echo ERROR: index.html was not found in this folder.
  echo.
  echo Download MilePilot-WEBSITE-v4.6-DOWNLOAD.zip from GitHub,
  echo unzip it to a NEW folder, then double-click OPEN-WEBSITE.bat
  echo from inside that unzipped folder.
  echo.
  echo This folder: %CD%
  echo.
  pause
  exit /b 1
)

if exist "%~dp0VERSION.txt" (
  type "%~dp0VERSION.txt"
  echo.
)

set "PAGE=%~dp0index.html"
echo Opening website in your default browser...
echo %PAGE%
echo.

start "" "%PAGE%"

echo.
echo If nothing opened, try one of these:
echo   1. Double-click index.html in this folder
echo   2. Drag index.html into Chrome, Edge or Firefox
echo.
echo Folder: %CD%
echo.
pause
exit /b 0
