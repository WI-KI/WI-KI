#! /bin/bash

# ./build.sh [tag version]

mv config-client.ts config-client-dev.ts
mv config-client-production.ts config-client.ts

cd pc || exit 1
yarn build

cd ..

mv config-client.ts config-client-production.ts
mv config-client-dev.ts config-client.ts

cd gulp || exit 1
gulp

cd ../CDN || exit 1

git add .
git commit -m "release ${1}"
git push
git add .
git tag "${1}"
git push origin "${1}"

cd .. || exit 1
# git add .
# git commit -m $1
# git push



