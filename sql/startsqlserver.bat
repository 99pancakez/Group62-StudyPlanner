@echo off
cd /d "%~dp0"
echo Starting MySQL...
bin\mysqld.exe --datadir=".\data" --port=3306 --console --skip-log-bin