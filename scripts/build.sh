#!/usr/bin/env sh

#
# Build the Zoom App for production
#

set -eu
outDir='dist'

[ -d "$outDir" ] && rm -r "$outDir"
mkdir "$outDir"

cp -r package-lock.json server/{.env,package.json,/src/views} "$outDir"

npm run build -ws

if [ "${NODE_ENV:-}" != 'production' ]; then
  cp -r server/.env "$outDir"

  npm --prefix "$outDir" install "$outDir"
fi

cp -r app/dist "$outDir/public"

echo "$(basename "$0") - built to $PWD/$outDir folder"

exit
