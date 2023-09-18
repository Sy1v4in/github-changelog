FROM oven/bun:1.0

WORKDIR /usr/src/app

COPY package.json bun.lockb ./
RUN bun install
COPY . .

ENV NODE_ENV production

ENTRYPOINT [ "bun", "changelog.ts" ]
