ARG DOCKER_IMAGE_VERSION=master
ARG DOCKER_SERVER_HOST
ARG DOCKER_PROJECT_PATH
ARG DOCKER_NODE_VERSION
ARG APP_ENV=prod

FROM ${DOCKER_SERVER_HOST}/${DOCKER_PROJECT_PATH}/app-prod:${DOCKER_IMAGE_VERSION} AS app
FROM ${DOCKER_SERVER_HOST}/${DOCKER_PROJECT_PATH}/node${DOCKER_NODE_VERSION}-base:${DOCKER_IMAGE_VERSION}

RUN npm install pm2 -g
RUN mkdir -p /.pm2
RUN mkdir -p /.npm
RUN chown -R 1000:1000 /.pm2
RUN chown -R 1000:1000 /.npm
USER 1000
RUN pm2 install pm2-metrics
USER 0

COPY --from=app /app/dist /app

WORKDIR /app

STOPSIGNAL SIGINT

#"--no-autorestart"
CMD ["pm2-runtime", "--raw", "app.js"]
