ARG IMAGE_SHA_TAG=latest
FROM docker.pkg.github.com/mvgijssel/setup/base-image:${IMAGE_SHA_TAG}

WORKDIR /app

# TODO: maybe only qemu-utils and qemu-system-x86_64
RUN apt-get install -y \
    squashfs-tools \
    curl \
    wget \
    sudo \
    qemu \
    expect \
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
    syslinux-common

RUN mkdir -p /app/elements /app/images
ENV ELEMENTS_PATH '/app/elements'

RUN git clone -b '2.33.0' --single-branch --depth 1 https://github.com/openstack/diskimage-builder.git
RUN pip install -e diskimage-builder
