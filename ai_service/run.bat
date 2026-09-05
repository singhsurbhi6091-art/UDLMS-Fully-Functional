@echo off
echo Starting UDLMS AI OCR Service on http://localhost:8000 ...
cd /d "%~dp0"

set "PY_CMD=python"
if exist "..\.venv\Scripts\python.exe" (
    set "PY_CMD=..\.venv\Scripts\python.exe"
)

%PY_CMD% -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
