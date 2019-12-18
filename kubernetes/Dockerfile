# syntax = docker/dockerfile:experimental
FROM ubuntu:bionic

WORKDIR /app

ENV DISTRO bionic

# Setup locale
RUN --mount=id=${DISTRO},type=cache,target=/var/cache/apt \
    --mount=id=${DISTRO},type=cache,target=/var/lib/apt \
    apt-get update \
    && apt-get install -y locales \
    && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8

ENV LANG en_US.utf8

# Setup the timezone
ENV TZ 'Europe/Amsterdam'

RUN --mount=id=${DISTRO},type=cache,target=/var/cache/apt \
    --mount=id=${DISTRO},type=cache,target=/var/lib/apt \
    echo $TZ > /etc/timezone \
    && apt-get install -y tzdata \
    && rm /etc/localtime \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && dpkg-reconfigure -f noninteractive tzdata

ENV DEBIAN_FRONTEND 'noninteractive'

RUN --mount=id=${DISTRO},type=cache,target=/var/cache/apt \
    --mount=id=${DISTRO},type=cache,target=/var/lib/apt \
    apt-get install -y \
    squashfs-tools \
    curl \
    wget \
    sudo \
    python3-pip \
    qemu-utils \
    kpartx \
    build-essential \
    module-assistant \
    debian-keyring \
    libguestfs-tools \
    debootstrap \
    shim-signed \
    syslinux \
    isolinux \
    syslinux-common

# Install kernel headers
RUN module-assistant prepare --non-inter

# For some reason python 2 takes a huge amount of time to install
# Like `apt-get install python-xdg` hangs for a huge amount of time
# Looks like it's compiling everything from source, but still it's
# strange that docker also becomes unresponsive
ENV DIB_PYTHON_VERSION 3
RUN pip3 install diskimage-builder
