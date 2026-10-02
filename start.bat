@echo off
echo Starting mysql local sever...

del "%~dp0middlelayer_failed.flag" >nul 2>&1
del "%~dp0frontend_failed.flag" >nul 2>&1

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

if exist "%~dp0middlelayer_failed.flag" (
    echo ERROR: Backend failed to start.
    goto cleanup
)

powershell -NoProfile -Command "if(-not (Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet)){exit 1}" >nul 2>&1
if errorlevel 1 (
    timeout /t 1 /nobreak >nul
    goto waitloop2
)

if exist "%~dp0frontlayer_failed.flag" (
    echo ERROR: Frontlayer failed to start.
    goto cleanup
)

echo Backend is up. Starting frontend...
start "Frontend" "%~dp0startfrontlayer.bat"

if exist "%~dp0frontend_failed.flag" (
    echo ERROR: Frontend failed to start.
    goto cleanup
)

pause

:cleanup
echo time to die
timeout /t 5 /nobreak >nul
taskkill /FI "WINDOWTITLE eq Server*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Backend*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Frontend*" /T /F >nul 2>&1
exit