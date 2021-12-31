include .env
export

build:
	docker build .docker/node$(DOCKER_NODE_VERSION)-base/ \
		--tag $(DOCKER_SERVER_HOST)/$(DOCKER_PROJECT_PATH)/node$(DOCKER_NODE_VERSION)-base:$(DOCKER_IMAGE_VERSION) \
		--build-arg DOCKER_SERVER_HOST=$(DOCKER_SERVER_HOST) \
		--build-arg DOCKER_PROJECT_PATH=$(DOCKER_PROJECT_PATH) \
		--build-arg DOCKER_NODE_VERSION=$(DOCKER_NODE_VERSION) \
		--build-arg DOCKER_IMAGE_VERSION=$(DOCKER_IMAGE_VERSION)
	docker build .docker/node$(DOCKER_NODE_VERSION)-yarn/ \
		--tag $(DOCKER_SERVER_HOST)/$(DOCKER_PROJECT_PATH)/node$(DOCKER_NODE_VERSION)-yarn:$(DOCKER_IMAGE_VERSION) \
		--build-arg DOCKER_SERVER_HOST=$(DOCKER_SERVER_HOST) \
		--build-arg DOCKER_PROJECT_PATH=$(DOCKER_PROJECT_PATH) \
		--build-arg DOCKER_NODE_VERSION=$(DOCKER_NODE_VERSION) \
		--build-arg DOCKER_IMAGE_VERSION=$(DOCKER_IMAGE_VERSION)
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

deploy:
	bash .pipelines/.pipelines-debug.sh
