ARG IMAGE_SHA_TAG=latest
ARG DOCKER_REGISTRY
FROM ${DOCKER_REGISTRY}/base-image:${IMAGE_SHA_TAG}

WORKDIR /app

RUN apt-get update && \
  apt-get install -y \
  git \
  gcc \
  binutils \
  make \
  perl \
  liblzma-dev \
  mtools \
  mkisofs \
  && rm -rf /var/lib/apt/lists/*

RUN git clone git://git.ipxe.org/ipxe.git

ADD console.h /app/ipxe/src/config/console.h

ADD embed.ipxe /app/ipxe/src/embed.ipxe

RUN cd /app/ipxe/src && make DEBUG=dhcp EMBED=embed.ipxe
