#!/bin/bash

if [ $LOCALHOST -eq 1 ]; then
  export WEB_ADDR=localhost:8000;
  export SYNC_ADDR=localhost:8001;
else
  export WEB_ADDR=159.203.88.91:8000;
  export SYNC_ADDR=159.203.88.91:8001;
fi

ADDR=$WEB_ADDR ./web & PID_LIST+=" $!"
ADDR=$SYNC_ADDR ./sync-server & PID_LIST+=" $!"
npm run webpack-watch & PID_LIST+=" $!"

trap "kill $PID_LIST" INT

wait $PID_LIST
