#!/usr/bin/env sh

#
# Build the Zoom App for production
#

set -eu

export NODE_ENV='production'
outDir='dist'

[ -d "$outDir" ] && rm -r "$outDir"
mkdir "$outDir"

npm run build -ws

cp -r .env package-lock.json server/src/views server/package.json "$outDir"
cp -r app/dist "$outDir/public"

echo "$(basename "$0") - built to $PWD/$outDir folder"

exit
