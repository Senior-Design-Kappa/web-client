all: build-all

build-web:
	go build github.com/Senior-Design-Kappa/web

build-sync-server:
	go build github.com/Senior-Design-Kappa/sync-server

build-web-client:
	npm run build

build-all: build-web build-sync-server build-web-client
