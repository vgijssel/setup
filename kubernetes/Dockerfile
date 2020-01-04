# syntax = docker/dockerfile:experimental
FROM ubuntu:bionic

ENV DISTRO_NAME ubuntu
ENV RELEASE bionic
ENV CACHE_KEY "$DISTRO_NAME:$RELEASE"

ENV container docker
ENV DEBIAN_FRONTEND noninteractive

# Setup locale
RUN --mount=id=${CACHE_KEY},type=cache,target=/var/cache/apt \
    --mount=id=${CACHE_KEY},type=cache,target=/var/lib/apt \
    apt-get update \
    && apt-get install -y locales \
    && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8

ENV LANG en_US.utf8
ENV LC_ALL en_US.utf8

# Setup the timezone
ENV TZ 'Europe/Amsterdam'

RUN --mount=id=${CACHE_KEY},type=cache,target=/var/cache/apt \
    --mount=id=${CACHE_KEY},type=cache,target=/var/lib/apt \
    echo $TZ > /etc/timezone \
    && apt-get install -y tzdata \
    && rm /etc/localtime \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && dpkg-reconfigure -f noninteractive tzdata


WORKDIR /app

RUN --mount=id=${CACHE_KEY},type=cache,target=/var/cache/apt \
    --mount=id=${CACHE_KEY},type=cache,target=/var/lib/apt \
    apt-get install -y \
    squashfs-tools \
    curl \
    wget \
    sudo \
    python-pip \
    qemu-utils \
    kpartx \
    build-essential \
    debian-keyring \
    linux-virtual \
    libguestfs-tools \
    debootstrap \
    shim-signed \
    syslinux \
    isolinux \
    syslinux-common

RUN mkdir -p /elements /images
ENV ELEMENTS_PATH '/elements'
RUN pip install diskimage-builder
