@echo off
echo Starting mysql local sever...

echo Waiting for port 3306...
start "Server" "%~dp0sql\startsqlserver.bat"
:waitloop1
powershell -NoProfile -Command "if(-not (Test-NetConnection -ComputerName localhost -Port 3306 -InformationLevel Quiet)){exit 1}" >nul 2>&1
if errorlevel 1 (
    timeout /t 1 /nobreak >nul
    goto waitloop1
)


echo Starting backend...
start "Backend" "%~dp0startmiddlelayer.bat"

echo Waiting for backend on port 3000...
:waitloop2
powershell -NoProfile -Command "if(-not (Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet)){exit 1}" >nul 2>&1
if errorlevel 1 (
    timeout /t 1 /nobreak >nul
    goto waitloop2
)

echo Backend is up. Starting frontend...
start "Frontend" "%~dp0startfrontlayer.bat"