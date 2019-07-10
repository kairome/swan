DEV_PORT = 4005

PWD = $(shell pwd)
BIN_PATH = $(PWD)/node_modules/.bin

export PATH := $(PWD)/node_modules/.bin:$(PATH)

clean-build:
	rm -rf build/ lib/

clean: clean-build
	rm -rf node_modules/

install: clean
	yarn cache clean
	yarn --pure-lockfile

dev:
	$(BIN_PATH)/webpack-dev-server \
    	--inline --watch --hot --progress --content-base=build --port $(DEV_PORT)

nodemon:
	DEV_PORT=$(DEV_PORT) nodemon -L --watch .env ./lib/server.js

build-prod-server:
	$(BIN_PATH)/tsc -p server/

build-prod: clean-build build-prod-server
	NODE_ENV=production webpack --progress

build: install check build-prod

launch:
	NODE_ENV=production node ./lib/server.js

check:
	yarn lint-client && yarn lint-server

fix-lint:
	yarn fix-lint-client && yarn fix-lint-server

build-electron:
	webpack --config webpack.electron.config.js --progress

launch-electron:
	electron ./build/main.js

electron: build-electron launch-electron

.PHONY: clean-build clean install build-dev build-dev-server dev nodemon build-prod-server build-prod build launch check fix-lint
