include .env
export

build:
	docker build .docker/app/ -t docker.local/rundax/minter/node_monitoring/app:$(CI_COMMIT_REF_SLUG)
	docker-compose build --pull
down:
	docker-compose down
up:
	docker-compose up
clear:
	rm -rf app/dist
	rm -rf app/node_modules
	rm -rf app/yarn-error.log

fix-permission:
	chown -R $(shell whoami):$(shell whoami) *
	chown -R $(shell whoami):$(shell whoami) .docker/
