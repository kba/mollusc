FROM node:10
WORKDIR /app
COPY package.json ./
RUN npm install

COPY lerna.json ./
COPY mollusc-backend mollusc-backend
COPY mollusc-cli mollusc-cli
COPY mollusc-server mollusc-server
COPY mollusc-shared mollusc-shared
COPY mollusc-webui mollusc-webui
COPY Makefile ./

RUN make lerna LERNA_BOOTSTRAP_ARGS=--hoist

RUN apt-get update && apt-get install -y \
        python3-pip
RUN pip3 install 'kraken' 'ocrd-fork-ocropy>=1.4a3'

EXPOSE 3434
# CMD ["node", "mollusc-cli/src/index.js", "start-server"]
# CMD ["ls", "-la"]
CMD ["python3", "--version"]
