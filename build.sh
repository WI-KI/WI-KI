#! /bin/bash

TOP_DIR="$(dirname "$(realpath "${BASH_SOURCE[0]}")")"
MAIN_DIR="${TOP_DIR}/packages"

export UMI_ENV=build

cd "${MAIN_DIR}"/pc || exit 1

pnpm build

cd "${MAIN_DIR}"/gulp || exit 1

gulp
