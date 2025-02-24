FROM node:22.13.1

WORKDIR /src

COPY package.json* ./

RUN npm install && apt update && apt install -y alsa-utils