DEV_PORT = 4005

PWD = $(shell pwd)
BIN_PATH = $(PWD)/node_modules/.bin

export PATH := $(PWD)/node_modules/.bin:$(PATH)

clean-build:
	rm -rf build/ lib/

clean: clean-build
	rm -rf node_modules/

install: clean
	yarn --pure-lockfile

check-types:
	tsc

dev: check-types
	$(BIN_PATH)/webpack-dev-server \
    	--inline --watch --hot --progress --content-base=build --port $(DEV_PORT)

build-prod: clean-build build-electron-prod
	NODE_ENV=production webpack --progress

build: install check-types lint build-prod

lint:
	eslint --ext .ts,.tsx ./src ./app

fix-lint:
	eslint --ext .ts,.tsx ./src ./app --fix

build-electron:
	webpack --config webpack.electron.config.js --progress

build-electron-prod:
	NODE_ENV=production webpack --config webpack.electron.config.js --progress

launch-electron:
	electron ./build/main.js

electron: build-electron launch-electron

package-deb:
	yarn run package-linux && yarn run debian-installer

package-mac:
	yarn run package-mac && yarn run dmg-installer

package-windows:
	yarn run package-windows && yarn run windows-installer

.PHONY: clean-build clean install check-types dev build-prod build lint fix-lint build-electron launch-electron electron build-electron-prod
