@echo off
setlocal EnableExtensions
title MilePilot Website
cd /d "%~dp0"

echo.
echo ========================================
echo   MilePilot Website
echo ========================================
echo.

set "MISSING="
for %%F in (index.html styles.css milepilot-theme.css main.js) do (
  if not exist "%%~F" set "MISSING=%%~F"
)

if defined MISSING (
  echo ERROR: Missing file: %MISSING%
  echo.
  echo All website files must sit in the SAME folder as this .bat file.
  echo.
  echo 1. Download MilePilot-WEBSITE-v4.6.2-DOWNLOAD.zip from GitHub
  echo 2. Right-click the zip -^> Extract All... to a NEW folder
  echo 3. Open that folder and double-click OPEN-WEBSITE.bat
  echo.
  echo This folder: %CD%
  echo.
  pause
  exit /b 1
)

if exist "VERSION.txt" (
  type "VERSION.txt"
  echo.
)

set "PAGE=%~dp0index.html"
echo Opening the website in your browser...
echo NOT in Notepad.
echo.
echo %PAGE%
echo.

if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
  start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" "%PAGE%"
  goto opened
)
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
  start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" "%PAGE%"
  goto opened
)
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%PAGE%"
  goto opened
)
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
  start "" "%LocalAppData%\Google\Chrome\Application\chrome.exe" "%PAGE%"
  goto opened
)
if exist "%ProgramFiles%\Mozilla Firefox\firefox.exe" (
  start "" "%ProgramFiles%\Mozilla Firefox\firefox.exe" "%PAGE%"
  goto opened
)

echo Could not find Edge, Chrome or Firefox automatically.
echo Trying your default app...
start "" "%PAGE%"

:opened
echo.
echo If you still see CODE in Notepad instead of the website:
echo   Right-click index.html  -^>  Open with  -^>  Microsoft Edge
echo.
echo Keep all files in this folder:
echo   %CD%
echo.
pause
exit /b 0
