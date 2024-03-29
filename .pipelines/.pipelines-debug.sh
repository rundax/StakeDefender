#!/usr/bin/env bash

set -e
set -u
set -o pipefail

#---------------GLOBAL vars -------------

export PROD_ENV=staging
export DEV_ENV=dev

#---------------DEV vars -------------
export KUBE_NAMESPACE_PREFIX=stake-defender
export CI_PROJECT_NAME=stake-defender
export ADMIN_EMAIL=root@localhost

source .pipelines/.env
if [ -f ".pipelines/.env.local" ]; then
    source .pipelines/.env.local
fi

if [ -f ".pipelines/.env.json" ]; then
    for s in $(cat .pipelines/.env.json | jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]" ); do
        export $s
    done
fi

#import functions
. .gitlab-ci-functions/docker.sh
. .gitlab-ci-functions/kubernetes.sh
. .gitlab-ci-functions/mysql.sh
. .gitlab-ci-functions/misc.sh
. .gitlab-ci-functions/trycatch.sh

. .pipelines/transform_from_jenkins.sh
. .pipelines/before_step.sh


. .pipelines/build_images.sh
. .pipelines/app_image.sh
. .pipelines/app_test.sh
. .pipelines/prerequisites.sh
. .pipelines/app_deploy.sh
