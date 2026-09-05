@echo off
cd /d "%~dp0"
title UDLMS - Unified Digital Legal Metrology System
echo ======================================================================
echo          UDLMS - Unified Digital Legal Metrology System
echo               Smart India Hackathon 2026 Prototype
echo ======================================================================
echo.
echo [1/3] Starting AI OCR Microservice (FastAPI + Tesseract) on port 8000...
start "UDLMS - AI OCR Service (Port 8000)" cmd /k "cd ai_service && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Spring Boot REST API (Port 8080)...
start "UDLMS - Spring Boot Backend (Port 8080)" cmd /k "cd backend && call mvnw.cmd spring-boot:run"

timeout /t 2 /nobreak >nul

echo [3/3] Starting React Vite Frontend (Port 5173)...
start "UDLMS - React Web Frontend" cmd /k "npm run dev"

echo.
echo ======================================================================
echo   All 3 services launched in separate windows!
echo   Frontend: http://localhost:5173/UDLMS/
echo   Backend:  http://localhost:8080/api/instruments
echo   AI OCR:   http://localhost:8000/docs
echo ======================================================================
pause
