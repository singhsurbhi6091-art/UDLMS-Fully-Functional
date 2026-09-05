@echo off
echo ========================================================
echo   Starting UDLMS Spring Boot REST API on port 8080 ...
echo ========================================================
cd /d "%~dp0"
call mvnw.cmd spring-boot:run
pause
