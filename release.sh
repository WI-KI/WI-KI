#! /bin/bash

TOP_DIR="$(dirname "$(realpath "${BASH_SOURCE[0]}")")"
MAIN_DIR="${TOP_DIR}/packages"

VERSION="0.0.0"

sed -i "" "s|\"version\": \".*\",|\"version\": \"${VERSION}\",|" package.json
sed -i "" "s|\"version\": \".*\",|\"version\": \"${VERSION}\",|" "${MAIN_DIR}"/**/package.json

git add .
git commit -m "chore: release v${VERSION}"
git push

git tag "${VERSION}"
git push --tags
