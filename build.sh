#!/usr/bin/env sh

##
# Build the Zoom App for production
##

set -eu

export NODE_ENV=production
outputDir='dist'

npm run build -ws

cp -r server/dist "$outputDir"
cp -r app/dist "$outputDir/pubic"

cd "$outputDir"
npm install --only=production
cd - > /dev/null

echo "$(basename "$0") - built to $PWD/$outputDir folder"

exit
