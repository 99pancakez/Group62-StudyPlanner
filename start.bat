@echo off
title Launcher
echo Starting mysql local sever...

if not exist "%~dp0firstsetupflag.txt" (
    echo First setup: initialising MySQL data directory...
    if exist "%~dp0sql\data" rmdir /s /q "%~dp0sql\data"
    pushd "%~dp0sql"
    bin\mysqld.exe --initialize-insecure --datadir=".\data" --console
    if not errorlevel 1 echo setup done > "%~dp0firstsetupflag.txt"
    popd
)

del "%~dp0middlelayer_failed.flag" >nul 2>&1
del "%~dp0frontend_failed.flag" >nul 2>&1

echo Waiting for port 3306...
start "Server" /min conhost.exe cmd /c ""%~dp0sql\startsqlserver.bat""
:waitloop1
powershell -NoProfile -Command "if(-not (Test-NetConnection -ComputerName localhost -Port 3306 -InformationLevel Quiet)){exit 1}" >nul 2>&1
if errorlevel 1 (
    timeout /t 1 /nobreak >nul
    goto waitloop1
)

echo Starting backend...
start "Backend" /min conhost.exe cmd /c ""%~dp0startmiddlelayer.bat""

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
start "Frontend" /min conhost.exe cmd /c ""%~dp0startfrontlayer.bat""

start "" "http://localhost:3001"

if exist "%~dp0frontend_failed.flag" (
    echo ERROR: Frontend failed to start.
    goto cleanup
)

echo "--------"
echo Program running: press any key to exit.
echo "--------"

title Launcher

pause

:cleanup

taskkill /FI "WINDOWTITLE eq Backend*"
timeout /t 1 /nobreak >nul
taskkill /FI "WINDOWTITLE eq Server*"
powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'cmd.exe' -and $_.CommandLine -match 'startfrontlayer' } | ForEach-Object { taskkill /PID $_.ProcessId /T /F }" >nul 2>&1

exit
