#!/usr/bin/env sh

##
# Build the Zoom App for production
##

set -eu

export NODE_ENV='production'
outDir='dist'

[ -d "$outDir" ] && rm -r "$outDir"
mkdir -p "$outDir"

npm run build -ws

cp -r server/dist "$outDir"
cp -r app/dist "$outDir/pubic"

cd "$outDir"
npm install --only=production
cd - > /dev/null

echo "$(basename "$0") - built to $PWD/$outDir folder"

exit
