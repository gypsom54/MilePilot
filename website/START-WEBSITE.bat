@echo off
setlocal EnableExtensions
title MilePilot Website
cd /d "%~dp0"

if not exist "index.html" (
  echo ERROR: index.html not found in %CD%
  pause
  exit /b 1
)

set "PAGE=%~dp0index.html"
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
  start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" "%PAGE%"
  exit /b 0
)
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%PAGE%"
  exit /b 0
)
start "" "%PAGE%"
