FROM ubuntu:trusty-20160819
MAINTAINER sameer@damagehead.com

RUN echo 'APT::Install-Recommends 0;' >> /etc/apt/apt.conf.d/01norecommends \
 && echo 'APT::Install-Suggests 0;' >> /etc/apt/apt.conf.d/01norecommends \
 && apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y vim.tiny wget sudo net-tools ca-certificates unzip \
 && rm -rf /var/lib/apt/lists/*

RUN  \
  cd /opt && \
  wget http://nodejs.org/dist/v7.8.0/node-v7.8.0-linux-x64.tar.gz && \
  tar -xzf node-v7.8.0-linux-x64.tar.gz && \
  mv node-v7.8.0-linux-x64 node && \
  cd /usr/local/bin && \
  ln -s /opt/node/bin/* . && \
  DEBIAN_FRONTEND=noninteractive npm install -g nodemon --no-optional && \
  sudo ln -s /opt/node/lib/node_modules/nodemon/bin/nodemon.js /usr/bin/nodemon && \
  rm -f /opt/node-v7.8.0-linux-x64.tar.gz

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/package.json
RUN cd /tmp && npm install --production
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
WORKDIR /opt/app
ADD . /opt/app

EXPOSE 7001

CMD [ "node","index.js" ]
