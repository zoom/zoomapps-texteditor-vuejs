#!/usr/bin/env sh

##
# Prepare the development servers for backend and frontend
##

set -eu

##
# Start server and app development servers
##
serve() {
  npx concurrently -kn 'server,app' -c 'inverse.yellow,inverse.blue' 'npm:dev -w server' 'npm:dev -w app'
}

# narrow the debug logs to our app - fallback to a wildcard
DEBUG="$(npx dotenv -p APP_NAME)*"
export DEBUG;

# start mongoDB in a container
docker compose up -d mongodb

# copy non-code files to the dist folder
mkdir -p dist
cp -r .env package-lock.json server/src/views server/package.json dist/

# start dev servers
serve

# stop mongodb up when we're done
docker compose down -v -v --remove-orphans

exit

