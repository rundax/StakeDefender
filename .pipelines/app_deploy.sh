#!/usr/bin/env bash
function app_deploy() {
    echo "$(tput bold)$(tput setb 4)$(tput setaf 3)$1$(tput sgr0)"
    HELM_APP_NAME=$2
    rancher_login && helm_cluster_login
    sed \
        -e "s#__APP_NAME__#${APP_VALIDATOR_NAME}#g" \
        \
        .helm/${CI_PROJECT_NAME}-${HELM_APP_NAME}/Chart.template.yaml > \
        .helm/${CI_PROJECT_NAME}-${HELM_APP_NAME}/Chart.yaml

     $HELM upgrade \
        --debug \
        --wait \
        --namespace ${KUBE_NAMESPACE} \
        --install ${CI_PROJECT_NAME}-${APP_VALIDATOR_NAME} \
        .helm/${CI_PROJECT_NAME}-${HELM_APP_NAME} \
        \
        --set env=${HELM_ENV} \
        --set image.repository.host=${DOCKER_SERVER_HOST} \
        --set image.repository.port=${DOCKER_SERVER_PORT} \
        --set image.tag=${DOCKER_IMAGE_VERSION} \
        --set image.repository.project=${DOCKER_PROJECT_PATH} \
        --set image.repository.app_name=${HELM_APP_NAME} \
        --set image.repository.env=dev


}

app_deploy "Deploy helm dev_job" "app"
