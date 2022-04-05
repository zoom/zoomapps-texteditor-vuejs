# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:17-alpine AS base

WORKDIR /home/node/app

COPY package*.json ./

FROM base AS deps
RUN npm install

FROM deps AS app
COPY ./dist/* .
CMD [ "npm", "start" ]
