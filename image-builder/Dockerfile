ARG IMAGE_SHA_TAG=latest
ARG DOCKER_REGISTRY
FROM ${DOCKER_REGISTRY}/base-image:${IMAGE_SHA_TAG}

WORKDIR /app

RUN apt-get update && \
    apt-get install -y \
    squashfs-tools \
    curl \
    wget \
    sudo \
    qemu-utils \
    iptables \
    kpartx \
    git \
    python-pip \
    build-essential \
    debian-keyring \
    linux-virtual \
    libguestfs-tools \
    debootstrap \
    shim-signed \
    syslinux \
    isolinux \
    syslinux-common \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app/local_elements /app/global_elements /app/image /app/diskimage-builder
ENV ELEMENTS_PATH '/app/local_elements:/app/global_elements'

ENV DISK_IMAGE_SHA '41c9f247e733bda0a9da5fb339d2c5209aaa5125'

RUN cd diskimage-builder && \
  git init && \
  git remote add origin https://github.com/mvgijssel/diskimage-builder.git && \
  git fetch --depth 1 origin $DISK_IMAGE_SHA && \
  git checkout FETCH_HEAD

RUN pip install -e diskimage-builder
