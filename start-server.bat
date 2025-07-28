@echo off
echo Starting Coloring Book Maker Server...
cd /d "%~dp0"

echo Trying to start Python server...
python -m http.server 8000 -d src

pause