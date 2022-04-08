#!/usr/bin/env sh

#
# Start the development servers
#

set -eu

serve() {
  npx concurrently \
  -kn 'dev-app,dev-server,' \
  -c 'inverse.cyan,inverse.yellow,' \
  "wait-on tcp:$1 && npm run dev -w app" \
  'npm:dev -w server'
}

getConfig() {
  npx dotenv -p "$1"
}

PORT="$(getConfig 'PORT')"
DEBUG="$(getConfig 'APP_NAME')*"

export NODE_ENV='development'
export DEBUG;

# start mongoDB in a container
docker compose up -d

# copy non-code files to the dist folder
cp -r .env package-lock.json server/src/views server/package.json dist/

# start dev servers
serve "$PORT"

# stop mongodb up when we're done
docker compose down -v --remove-orphans

exit

