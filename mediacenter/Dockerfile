# syntax = docker/dockerfile:experimental
FROM debian:buster
# FROM ubuntu:latest
# FROM ubuntu:xenial

# ENV OS debian
# ENV VERSION buster

# RUN echo $OS
# RUN echo $VERSION

# Setup the locale
RUN --mount=id=buster,type=cache,target=/var/cache/apt \
    --mount=id=buster,type=cache,target=/var/lib/apt \
    apt-get update \
    && apt-get install -y locales \
    && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8

ENV LANG en_US.utf8

# Setup the timezone
ENV TZ 'Europe/Amsterdam'

RUN --mount=id=buster,type=cache,target=/var/cache/apt \
    --mount=id=buster,type=cache,target=/var/lib/apt \
    echo $TZ > /etc/timezone \
    && apt-get install -y tzdata \
    && rm /etc/localtime \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && dpkg-reconfigure -f noninteractive tzdata

RUN --mount=id=buster,type=cache,target=/var/cache/apt \
    --mount=id=buster,type=cache,target=/var/lib/apt \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
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
    syslinux-common \
    git \
    tox

# debootstrap \
# grub-efi-amd64 \
# grub-efi-amd64-signed
# linux-image-4.4.0-169-generic


# isolinux
# syslinux
# shim-signed


# Normally debootstrap 1.0.89 is installed for debian buster
# RUN wget http://ftp.debian.org/debian/pool/main/d/debootstrap/debootstrap_1.0.116_all.deb
# RUN dpkg -i debootstrap_1.0.116_all.deb

WORKDIR /app

# Install kernel headers
# RUN module-assistant prepare --non-inter

# For some reason python 2 takes a huge amount of time to install
# Like `apt-get install python-xdg` hangs for a huge amount of time
# Looks like it's compiling everything from source, but still it's
# strange that docker also becomes unresponsive
ENV DIB_PYTHON_VERSION 3

  # software-properties-common

RUN pip3 install diskimage-builder

COPY scripts scripts
