#! /bin/sh

set -e -x

PC_PATH="/app/pc"
EXPORT_PATH="/app/export"
EXPORT_PC_PATH="${EXPORT_PATH}/pc"

if [ -z "${PUBLIC_CDN_PATH}" ]; then
    PUBLIC_CDN_PATH=""
fi

sed -i "s|__PUBLIC_CDN_PATH__|${PUBLIC_CDN_PATH}|g" ./**/index.html

if [ -d "${EXPORT_PC_PATH}" ]; then
    cp -a "${PC_PATH}"/* "${EXPORT_PC_PATH}"/
fi

if [ X"${CONTAINER_TIMEZONE}" != X"" ]; then
    ln -snf /usr/share/zoneinfo/"${CONTAINER_TIMEZONE}" /etc/localtime
    echo "${CONTAINER_TIMEZONE}" >/etc/timezone
    echo "[ok] Container timezone set to: ${CONTAINER_TIMEZONE}"
    date
fi

if [ X"${1}" = X"primary" ]; then
    exec node /app/server/bin/www
else
    exec "${@}"
fi
