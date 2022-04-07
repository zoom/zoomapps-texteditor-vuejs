#!/usr/bin/env sh

#
# Start the development servers
#

set -eu

serve() {
  npx concurrently \
  -kn 'dev-app,dev-server,' \
  -c 'inverse.cyan,inverse.yellow,' \
  'npm:dev -w app' \
  'npm:dev -w server'
}
export NODE_ENV='development'

# narrow the debug logs to our app - fallback to a wildcard
DEBUG="$(npx dotenv -p APP_NAME)*"
export DEBUG;

# start mongoDB in a container
docker compose up -d

# copy non-code files to the dist folder
mkdir -p dist
cp -r .env package-lock.json server/src/views server/package.json dist/

# start dev servers
serve

# stop mongodb up when we're done
docker compose down -v --remove-orphans

exit

