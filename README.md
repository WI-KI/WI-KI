# WI-KI

## Getting Started

Install dependencies,

```bash
$ pnpm install
```

Start the dev server,

```bash
$ pnpm start [-p 6000]
```

Run in the Serve

```bash
pnpm build
pnpm add global serve
pnpm serve dist -s [-p 6000]
```

Run the Server

```bash
nodemon start
# 以四个进程负载均衡运行
pm2 start bin/www --name="wiki-api" -i 4
```

## Docker

Build

```bash
docker build -t wi-ki -f ./docker/Dockerfile ./
```

Run

```bash
docker run \
    -d \
    --restart=always \
    --name="wi-ki" \
     -p 3000:3000 \
    -e CONTAINER_TIMEZONE=Asia/Shanghai \
    -v "${PWD}/config-server.js":/app/config-server.js \
    dup4/wi-ki:latest
```
