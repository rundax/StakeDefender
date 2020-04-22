ARG DOCKER_IMAGE_VERSION=master
ARG DOCKER_SERVER_HOST
ARG DOCKER_PROJECT_PATH
ARG DOCKER_SERVER_PORT

FROM ${DOCKER_SERVER_HOST}:${DOCKER_SERVER_PORT}/${DOCKER_PROJECT_PATH}/node-base:${DOCKER_IMAGE_VERSION}
ARG DOCKER_MINTER_VERSION
# -------------------- dwonload minter node --------------------
RUN set -eux \
    && mkdir -p /minter/bin \
    && mkdir -p /minter/conf \
	&& wget https://github.com/MinterTeam/minter-go-node/releases/download/v${DOCKER_MINTER_VERSION}/minter_${DOCKER_MINTER_VERSION}_linux_amd64.zip \
	&& unzip minter_${DOCKER_MINTER_VERSION}_linux_amd64.zip -d /minter/bin \
	&& mv /minter/bin/minter /minter/bin/minter_${DOCKER_MINTER_VERSION}_linux_amd64 \
	&& true

RUN yarn global add webpack webpack-cli typescript ts-node
CMD ["yarn", "develop"]
