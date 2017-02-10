#!/bin/bash
ADDR=$WEB_ADDR ./web & PID_LIST+=" $!"
ADDR=$SYNC_ADDR ./sync-server & PID_LIST+=" $!"
npm run webpack-watch & PID_LIST+=" $!"

trap "kill $PID_LIST" INT

wait $PID_LIST
