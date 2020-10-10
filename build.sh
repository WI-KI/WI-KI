#! /bin/bash

# ./build.sh [tag version]

mv config-client.ts config-client-dev.ts
mv config-client-production.ts config-client.ts

cd pc
yarn build

cd ..

mv config-client.ts config-client-production.ts
mv config-client-dev.ts config-client.ts

cd gulp
gulp

cd ../CDN
git add .
git commit -m "release "$1
git push
git add .
git tag $1
# git tag
git push origin $1

cd ..
# git add .
# git commit -m $1
# git push



