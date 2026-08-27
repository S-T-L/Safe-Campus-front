FROM node:22

LABEL maintainer="Safe Campus"

WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive

# UID/GID de l'utilisateur hote : l'utilisateur du conteneur est cree avec les
# memes identifiants, les fichiers ecrits dans le bind mount lui appartiennent.
ARG WWWUSER=1000
ARG WWWGROUP=1000
ARG FRONT_PORT=3000

RUN apt-get update && apt-get install -y --no-install-recommends git bash sudo \
    && userdel node 2>/dev/null || true \
    && groupadd -g $WWWGROUP nuxt \
    && useradd -u $WWWUSER -g nuxt -s /bin/bash -m nuxt \
    && echo 'nuxt ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers \
    && mkdir -p /tmp/.X11-unix && chmod 1777 /tmp/.X11-unix \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY docker/start-container /usr/local/bin/start-container
RUN chmod +x /usr/local/bin/start-container

USER nuxt

EXPOSE ${FRONT_PORT}

ENTRYPOINT ["start-container"]
