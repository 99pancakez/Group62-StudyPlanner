echo start command 

cd "$(dirname "$0")" || exit 1

ROOT_DIR="$(pwd)"

echo "$ROOT_DIR"
ls "$ROOT_DIR/nodemac/bin"

if [ -f "$ROOT_DIR/nodemac/bin/node.tar.gz" ]; then
	echo found
else
	echo not found
fi

if [ ! -x "$ROOT_DIR/nodemac/bin/node" ]; then
    echo "Unpacking node..."

    echo "$ROOT_DIR/nodemac/bin/node"

    tar -xzf "$ROOT_DIR/nodemac/bin/node.tar.gz" -C "$ROOT_DIR/nodemac/bin"
fi

sleep 10

#reset data, start server
cd "$(dirname "$0")"
# ./sqlmac/startsqlserver.sh > sqlmac/mysql.log 2>&1 & SQL_PID = $1
open -a Terminal "$(pwd)/sqlmac/startsqlserver.sh"

#remove error files
rm -f ./middlelayer_failed.flag ./frontend_failed.flag

#wait until server
echo "waiting for port 3306"
until nc -zv 127.0.0.1 3306; do
	sleep 1
done

sleep 2

#start middlelayer
echo server started
open -a Terminal "$(pwd)/startmiddlelayer.sh"

#wait until middlelayer complete
echo "waiting for port 3000"
until nc -zv 127.0.0.1 3000; do
	if [ -f ./middlelayer_flag ]; then
		exit 1
	fi
done

#start frontend
echo middlelayer launched
open -a Terminal "$(pwd)/startfrontlayer.sh"
