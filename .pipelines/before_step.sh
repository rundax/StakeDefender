#!/usr/bin/env bash
registry_login

if [[ ! "$CI_COMMIT_REF_NAME" =~ ^v.* ]]; then
  APP_ENV="dev"
  KUBE_NAMESPACE=$(kubernetes_namespace_sanitize ${KUBE_NAMESPACE_PREFIX}-${CI_COMMIT_REF_NAME} 25)
fi

if [[ "$CI_COMMIT_REF_NAME" =~ ^v.* ]]; then
  APP_ENV="prod"
  KUBE_NAMESPACE=$(kubernetes_namespace_sanitize ${KUBE_NAMESPACE_PREFIX}-${PROD_ENV} 25)
fi

echo "APP_ENV - $APP_ENV"
echo "KUBE_NAMESPACE - $KUBE_NAMESPACE"
