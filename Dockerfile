FROM node:22-alpine

LABEL maintainer="Safe Campus"

ARG WWWGROUP=1000

WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive

RUN apk add --no-cache git bash sudo

RUN addgroup -g $WWWGROUP nuxt \
    && adduser -u 1000 -G nuxt -s /bin/bash -D nuxt \
    && echo 'nuxt ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers

COPY start-container /usr/local/bin/start-container
RUN chmod +x /usr/local/bin/start-container

# Port Nuxt dev server + port HMR Vite
EXPOSE 3000 24678

ENTRYPOINT ["start-container"]
