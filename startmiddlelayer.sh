
cd "$(dirname "$0")"

ROOT_DIR="$(pwd)"

NODE_DIR="$ROOT_DIR/nodemac"
export PATH="$NODE_DIR/bin:$PATH"
APP_DIR="$ROOT_DIR/middlelayer"

cd "$APP_DIR" || exit 1

if [ ! -d "node_modules" ]; then
	echo no node modules, installing
	if ! npm install express cors argon2 mysql2 react-select sequelize uuid jspdf jspdf-autotable pdfkit; then
    	echo "npm install failed, aborting"
    	echo "node failed" > $ROOT_DIR/middlelayer_failed.flag
    	read; exit 1
    fi
fi

sleep 1

if ! npm run db:import; then
	echo "db import failed, aborting"
	echo "node failed" > $ROOT_DIR/middlelayer_failed.flag
	exit 1
fi

$NODE_DIR/bin/node server.js

