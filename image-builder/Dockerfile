ARG IMAGE_SHA_TAG=latest
FROM docker.pkg.github.com/mvgijssel/setup/base-image:${IMAGE_SHA_TAG}

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

RUN mkdir -p /app/elements /app/images /app/diskimage-builder
ENV ELEMENTS_PATH '/app/elements'

RUN cd diskimage-builder && \
  git init && \
  git remote add origin https://github.com/mvgijssel/diskimage-builder.git && \
  git fetch --depth 1 origin '5a49bab1edb979b9ad6de4f7a80af52a196f458e' && \
  git checkout FETCH_HEAD

RUN pip install -e diskimage-builder
