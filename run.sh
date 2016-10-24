export WEB_ADDR=localhost:8000
export SYNC_ADDR=localhost:8001

ADDR=$WEB_ADDR ./web & PID_LIST+=" $!"
ADDR=$SYNC_ADDR ./sync-server & PID_LIST+=" $!"

trap "kill $PID_LIST" SIGINT

wait $PID_LIST
