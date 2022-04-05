# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:17-alpine AS base

WORKDIR /home/node/server

COPY package*.json ./

FROM base AS deps
ARG NODE_ENV
ENV NODE_ENV="${NODE_ENV}"
RUN npm clean-install

FROM deps AS server
COPY . .
RUN ./gen-secrets.sh
CMD [ "npm", "start" ]
