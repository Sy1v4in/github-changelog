FROM oven/bun:1.0

RUN \
  apt-get update -qq \
  && apt-get install -y --no-install-recommends \
    curl ca-certificates \
    jq \
  && apt-get clean \
  && rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/* /tmp/* /var/tmp/* \
  && truncate -s 0 /var/log/*log

WORKDIR /usr/src/app

COPY package.json bun.lockb ./
RUN bun install
COPY . .

ENV NODE_ENV production

ENTRYPOINT [ "bun", "index.ts" ]
