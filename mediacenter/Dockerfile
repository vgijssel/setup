# syntax = docker/dockerfile:experimental
FROM debian:stretch

# Setup the locale
RUN --mount=type=cache,target=/var/cache/apt \
    --mount=type=cache,target=/var/lib/apt \
    apt-get update \
    && apt-get install -y locales \
    && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8

ENV LANG en_US.utf8

# Setup the timezone
ENV TZ 'Europe/Amsterdam'

RUN --mount=type=cache,target=/var/cache/apt \
    --mount=type=cache,target=/var/lib/apt \
    echo $TZ > /etc/timezone \
    && apt-get install -y tzdata \
    && rm /etc/localtime \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && dpkg-reconfigure -f noninteractive tzdata

RUN --mount=type=cache,target=/var/cache/apt \
    --mount=type=cache,target=/var/lib/apt \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
    squashfs-tools \
    curl \
    sudo \
    python3-pip \
    qemu-utils \
    kpartx \
    build-essential \
    module-assistant \
    debootstrap \
    libguestfs-tools \
    git

WORKDIR /app

# For some reason python 2 takes a huge amount of time to install
# due to it compiling everything from source
ENV DIB_PYTHON_VERSION 3

RUN pip3 install diskimage-builder

COPY scripts scripts
