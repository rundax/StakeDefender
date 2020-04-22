ARG DOCKER_NODE_VERSION
FROM node:${DOCKER_NODE_VERSION}

WORKDIR /app

EXPOSE 8841 26656

STOPSIGNAL SIGTERM

COPY ./docker-entrypoint.sh /docker-entrypoint.sh
COPY ./docker-entrypoint.d /docker-entrypoint.d

RUN chmod +x /docker-entrypoint.sh

RUN yarn global add pm2

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["yarn", "start"]
