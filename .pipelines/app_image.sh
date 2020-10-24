#!/usr/bin/env bash
################### APP IMAGES ###################

function build_base_image_app() {
    echo "$(tput bold)$(tput setb 4)$(tput setaf 3)$1$(tput sgr0)"
    IMAGE=$2
    DOCKER_FILE=$3
    YARN_INSTALL_CMD=$4
    docker_build_file_args ${IMAGE} ${DOCKER_FILE} "\
            --progress=plain \
            --build-arg DOCKER_SERVER_HOST=${DOCKER_SERVER_HOST} \
            --build-arg DOCKER_SERVER_PORT=${DOCKER_SERVER_PORT} \
            --build-arg DOCKER_PROJECT_PATH=${DOCKER_PROJECT_PATH} \
            --build-arg DOCKER_NODE_VERSION=${DOCKER_NODE_VERSION} \
            --build-arg DOCKER_IMAGE_VERSION=${DOCKER_IMAGE_VERSION} \
            --build-arg YARN_INSTALL_CMD=\"${YARN_INSTALL_CMD}\" \
    "
    docker push ${IMAGE}
}

build_base_image_app "BUILD dev image" \
    "$DOCKER_SERVER_HOST:$DOCKER_SERVER_PORT/$DOCKER_PROJECT_PATH/app-dev:$DOCKER_IMAGE_VERSION" \
    .docker/app/Dockerfile \
    "yarn && yarn build-ci"


function build_app_image() {
    echo "$(tput bold)$(tput setb 4)$(tput setaf 3)$1$(tput sgr0)"
    IMAGE=$2
    DOCKER_FILE=$3
    APP_ENV=$4
    docker_build_file_args ${IMAGE} ${DOCKER_FILE} "\
            --progress=plain \
            --build-arg DOCKER_SERVER_HOST=$DOCKER_SERVER_HOST \
            --build-arg DOCKER_SERVER_PORT=$DOCKER_SERVER_PORT \
            --build-arg DOCKER_PROJECT_PATH=$DOCKER_PROJECT_PATH \
            --build-arg DOCKER_NODE_VERSION=$DOCKER_NODE_VERSION \
            --build-arg DOCKER_IMAGE_VERSION=$DOCKER_IMAGE_VERSION \
            --build-arg APP_ENV=${APP_ENV} \
    "
    docker push ${IMAGE}
}

function build_app_image() {
    echo "$(tput bold)$(tput setb 4)$(tput setaf 3)$1$(tput sgr0)"
    IMAGE=$2
    DOCKER_FILE=$3
    APP_ENV=$4
    docker_build_file_args ${IMAGE} ${DOCKER_FILE} "\
            --progress=plain \
            --build-arg DOCKER_SERVER_HOST=$DOCKER_SERVER_HOST \
            --build-arg DOCKER_SERVER_PORT=$DOCKER_SERVER_PORT \
            --build-arg DOCKER_PROJECT_PATH=$DOCKER_PROJECT_PATH \
            --build-arg DOCKER_NODE_VERSION=$DOCKER_NODE_VERSION \
            --build-arg DOCKER_IMAGE_VERSION=$DOCKER_IMAGE_VERSION \
            --build-arg APP_ENV=${APP_ENV} \
    "
    docker push ${IMAGE}
}

build_app_image "BUILD runner" \
    "$DOCKER_SERVER_HOST:$DOCKER_SERVER_PORT/$DOCKER_PROJECT_PATH/app/dev:$DOCKER_IMAGE_VERSION" \
    .docker/processor/Dockerfile \
    dev
