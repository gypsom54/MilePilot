@echo off
cd /d "%~dp0"
if exist "%~dp0OPEN-WEBSITE.vbs" (
  wscript.exe "%~dp0OPEN-WEBSITE.vbs"
  exit /b 0
)
echo ERROR: OPEN-WEBSITE.vbs is missing. Re-download the zip.
pause
exit /b 1
