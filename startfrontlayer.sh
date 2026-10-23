cd "$(dirname "$0")"
ROOT_DIR="$(pwd)"

NODE_DIR="$ROOT_DIR/nodemac"
export PATH="$NODE_DIR/bin:$PATH"
APP_DIR="$ROOT_DIR/frontend"


cd "$APP_DIR" || exit 1

if [ ! -d "node_modules" ]; then
    echo no node modules, installing
    if ! npm install; then
        echo "npm install failed, aborting"
        echo "node failed" > $ROOT_DIR/frontend_failed.flag
        read; exit 1
    fi
fi

export PORT=3001

if ! npm start; then
    echo npm start failed, aborting.
    echo node failed > "%$ROOT_DIR/rontend_failed.flag"
    exit 1
fi

pause