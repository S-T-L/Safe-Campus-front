FROM node:22

LABEL maintainer="Safe Campus"

WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive

ARG WWWGROUP=1000

RUN apt-get update && apt-get install -y --no-install-recommends git bash sudo \
    && userdel node 2>/dev/null || true \
    && groupadd -g $WWWGROUP nuxt \
    && useradd -u 1000 -g nuxt -s /bin/bash -m nuxt \
    && echo 'nuxt ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY start-container /usr/local/bin/start-container
RUN chmod +x /usr/local/bin/start-container

EXPOSE 3000

ENTRYPOINT ["start-container"]
