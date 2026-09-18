@echo off
cd /d "%~dp0"

set "NODE_DIR=%~dp0node"
set "PATH=%NODE_DIR%;%PATH%"
set "APP_DIR=%~dp0middlelayer"

cd /d "%APP_DIR%"

if not exist "node_modules" (
    echo node_modules not found, running npm install...
    call npm install express cors argon2 mysql2 react-select sequelize uuid jspdf jspdf-autotable pdfkit
    if errorlevel 1 (
        echo npm install failed, aborting.
        pause
        exit /b 1
    )
)

call npm run db:import
if errorlevel 1 (
    echo db:import failed, aborting.
    pause
    exit /b 1
)

"%NODE_DIR%\node.exe" server.js