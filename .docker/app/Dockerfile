FROM node:10

WORKDIR /app

RUN yarn global add webpack webpack-cli typescript nodemon

###########################################################################

RUN printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list

RUN apt-get update && apt install -y build-essential libsnappy-dev

RUN wget https://github.com/google/leveldb/archive/v1.20.tar.gz && \
  tar -zxvf v1.20.tar.gz && \
  cd leveldb-1.20/ && \
  make && \
  cp -r out-static/lib* out-shared/lib* /usr/local/lib/ && \
  cd include/ && \
  cp -r leveldb /usr/local/include/ && \
  ldconfig && \
  rm -f v1.20.tar.gz

# api port
EXPOSE 8841 46658 3000

RUN mkdir -p /minter/data && mkdir -p /minter/tmdata
RUN chown -R 1000:1000 /minter

###########################################################################
STOPSIGNAL SIGTERM

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod 755 /usr/local/bin/docker-entrypoint.sh

RUN yarn global add pm2

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["yarn", "start"]
