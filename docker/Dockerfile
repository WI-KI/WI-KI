FROM node:16 AS build

USER root
WORKDIR /app
COPY ./ ./blog

RUN cd blog \
    && npm i -g pnpm \
    && npm i -g gulp \
    && cp ./packages/config-client-example.ts ./packages/config-client.ts  \
    && pnpm i \
    && pnpm build \
    && mv ./docker/docker_entry.sh /app/docker_entry.sh \
    && cp -a ./packages/pc/dist /app/pc \
    && cp -a ./packages/server /app/server \
    && rm -rf /app/server/node_modules \
    && cp pnpm-lock.yaml /app/server/ \
    && rm -rf /app/blog

FROM node:16 AS build-server

USER root
WORKDIR /app

COPY --from=build /app ./

RUN cd server \
    && npm i -g pnpm \
    && pnpm i --production

FROM node:16-alpine

USER root
WORKDIR /app

COPY --from=build-server /app ./

RUN chmod +x /app/docker_entry.sh \
    && apk add tzdata \
    && apk add sed

ENTRYPOINT ["/app/docker_entry.sh"]

CMD ["primary"]
