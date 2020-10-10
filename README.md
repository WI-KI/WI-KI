# WI-KI 

## Getting Started

Install dependencies,

```bash
$ yarn install
```

Start the dev server,

```bash
$ yarn start [-p 6000]
```

Run in the Serve

```bash
yarn build
yarn add global serve
yarn serve dist -s [-p 6000]
```

Run the Server

```bash
nodemon start
# 以四个进程负载均衡运行
pm2 start bin/www --name="wiki-api" -i 4
```