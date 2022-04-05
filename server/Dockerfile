# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:17-alpine AS base

WORKDIR /home/node/app

COPY package*.json .env ./

FROM base AS deps
ARG NODE_ENV
ENV NODE_ENV="${NODE_ENV}"
RUN npm ci --only=production

FROM deps AS server
COPY ./dist/* .
CMD [ "npm", "start" ]
