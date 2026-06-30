@echo off
setlocal EnableExtensions
title MilePilot Website
cd /d "%~dp0"

if not exist "%~dp0index.html" (
  echo ERROR: index.html not found. Unzip the website download zip first.
  echo Folder: %CD%
  pause
  exit /b 1
)

if exist "%~dp0VERSION.txt" type "%~dp0VERSION.txt" & echo.

set "PAGE=%~dp0index.html"
start "" "%PAGE%"
echo Opened %PAGE%
timeout /t 2 /nobreak >nul
