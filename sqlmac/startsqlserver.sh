#!/bin/bash
cd "$(dirname "$0")"

pkill mysqld
sleep 1

echo "Resetting MySQL data directory..."
./bin/mysqld --initialize-insecure --datadir="./data" --console


echo Starting MySQL...
./bin/mysqld --datadir="./data" --port=3306 --console --skip-log-bin

