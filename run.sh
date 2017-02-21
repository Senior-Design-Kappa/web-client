#!/bin/bash
export WEB_ADDR=159.203.88.91:8000
export SYNC_ADDR=159.203.88.91:8001

ADDR=$WEB_ADDR ./web & PID_LIST+=" $!"
ADDR=$SYNC_ADDR ./sync-server & PID_LIST+=" $!"
npm run webpack-watch & PID_LIST+=" $!"

trap "kill $PID_LIST" SIGINT

wait $PID_LIST
