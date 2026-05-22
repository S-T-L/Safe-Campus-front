FROM node:22-alpine

LABEL maintainer="Safe Campus"

WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive

ARG WWWGROUP=1000

RUN apk add --no-cache git bash sudo \
    && deluser node 2>/dev/null || true \
    && delgroup node 2>/dev/null || true \
    && addgroup -g $WWWGROUP nuxt \
    && adduser -u 1000 -G nuxt -s /bin/bash -D nuxt \
    && echo 'nuxt ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers

COPY start-container /usr/local/bin/start-container
RUN chmod +x /usr/local/bin/start-container

# Port Nuxt dev server + port HMR Vite
EXPOSE 3000 24678

ENTRYPOINT ["start-container"]
