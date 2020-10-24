#!/usr/bin/env bash
try
(

  rancher_lock && rancher_login && helm_cluster_login
  rancher_namespace
  helm_init_namespace
  namespace_secret_additional_project_registry ${CI_PROJECT_NAME} ${CI_REGISTRY_USER} ${CI_JOB_TOKEN}

  ${KUBECTL} -n ${KUBE_NAMESPACE} create secret generic ${CI_PROJECT_NAME}-${APP_VALIDATOR_NAME} \
      --from-literal=APP_ENV="${APP_ENV}" \
      --from-literal=APP_DEBUG="${APP_DEBUG}" \
      --from-literal=APP_VERSION="${CI_COMMIT_REF_NAME}" \
      \
      --from-literal=APP_SENTRY_ENABLED="${APP_SENTRY_ENABLED}" \
      --from-literal=APP_SENTRY_DSN="${APP_SENTRY_DSN}" \
      \
      --from-literal=APP_VALIDATOR_NAME="${APP_VALIDATOR_NAME}" \
      --from-literal=APP_NODE_NETWORK="${APP_NODE_NETWORK}" \
      --from-literal=APP_NODE_API_TYPE="${APP_NODE_API_TYPE}" \
      --from-literal=APP_NODE_BASE_URL="${APP_NODE_BASE_URL}" \
      --from-literal=APP_NODE_PUBLIC_KEY_VALIDATOR="${APP_NODE_PUBLIC_KEY_VALIDATOR}" \
      --from-literal=APP_NODE_PRIVATE_KEY="${APP_NODE_PRIVATE_KEY}" \
      --from-literal=APP_NODE_API_DEBUG_PROXY="${APP_NODE_API_DEBUG_PROXY}" \
      --from-literal=APP_NODE_API_DEBUG_PROXY_HOST="${APP_NODE_API_DEBUG_PROXY_HOST}" \
      --from-literal=APP_NODE_API_DEBUG_PROXY_PORT="${APP_NODE_API_DEBUG_PROXY_PORT}" \
      --from-literal=APP_NODE_STOP_TEXT="${APP_NODE_STOP_TEXT}" \
      \
      --from-literal=APP_MONITORING_SPLASH_CHECKER_ENABLED="${APP_MONITORING_SPLASH_CHECKER_ENABLED}" \
      --from-literal=APP_MONITORING_SPLASH_CHECKER_KEY_VALIDATOR="${APP_MONITORING_SPLASH_CHECKER_KEY_VALIDATOR}" \
      --from-literal=APP_MONITORING_SPLASH_CHECKER_SKIPPED_BLOCK_LIMIT="${APP_MONITORING_SPLASH_CHECKER_SKIPPED_BLOCK_LIMIT}" \
      --from-literal=APP_MONITORING_BLOCK_NOTIFY_ENABLED="${APP_MONITORING_BLOCK_NOTIFY_ENABLED}" \
      --from-literal=APP_MONITORING_BLOCK_NOTIFY_REQUEST_INTERVAL="${APP_MONITORING_BLOCK_NOTIFY_REQUEST_INTERVAL}" \
      \
      --from-literal=APP_NOTIFY_ENABLED="${APP_NOTIFY_ENABLED}" \
      --from-literal=APP_NOTIFY_TELEGRAM_ENABLED="${APP_NOTIFY_TELEGRAM_ENABLED}" \
      --from-literal=APP_NOTIFY_TELEGRAM_CHAT_ID="${APP_NOTIFY_TELEGRAM_CHAT_ID}" \
      --from-literal=APP_NOTIFY_TELEGRAM_TOKEN="${APP_NOTIFY_TELEGRAM_TOKEN}" \
      \
  -o yaml --dry-run | ${KUBECTL} -n ${KUBE_NAMESPACE} replace --force -f -

  namespace_secret_acme_cert ingress-cert ${KUBE_INGRESS_CERT_HOSTNAME}
)
# directly after closing the subshell you need to connect a group to the catch using ||
catch || {
  rancher_logout && rancher_unlock helm_cluster_logout
  exit $ex_code
}

rancher_logout && rancher_unlock && helm_cluster_logout
