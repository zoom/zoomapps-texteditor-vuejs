#!/usr/bin/env sh

#
# Build the Zoom App for production
#

set -eu
outDir='dist'

[ -d "$outDir" ] && rm -r "$outDir"
mkdir "$outDir"

cp -r package-lock.json server/package.json server/src/views "$outDir"

npm --prefix "$outDir" install "$outDir"

 npm run build -ws


cp -r app/dist "$outDir/public"

echo "$(basename "$0") - built to $PWD/$outDir folder"

exit
