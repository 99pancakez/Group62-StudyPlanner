@echo off
cd /d "%~dp0"

set "NODE_DIR=%~dp0node"
set "PATH=%NODE_DIR%;%PATH%"
set "APP_DIR=%~dp0frontend"

cd /d "%APP_DIR%"

if not exist "node_modules" (
    echo node_modules not found, running npm install...
    call npm install
    if errorlevel 1 (
        echo npm install failed, aborting.
        pause
        exit /b 1
    )
)

set "PORT=3001"
call npm start
if errorlevel 1 (
    echo npm start failed, aborting.
    pause
    exit /b 1
)

pause