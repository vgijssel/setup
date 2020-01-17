FROM ubuntu:bionic

ENV DISTRO_NAME ubuntu
ENV RELEASE bionic
ENV CACHE_KEY "$DISTRO_NAME:$RELEASE"

ENV container docker
ENV DEBIAN_FRONTEND noninteractive

# Setup locale
RUN apt-get update \
    && apt-get install -y locales \
    && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8

ENV LANG en_US.utf8
ENV LC_ALL en_US.utf8

# Setup the timezone
ENV TZ 'Europe/Amsterdam'

RUN echo $TZ > /etc/timezone \
    && apt-get install -y tzdata \
    && rm /etc/localtime \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && dpkg-reconfigure -f noninteractive tzdata

WORKDIR /app

# TODO: maybe only qemu-utils and qemu-system-x86_64
RUN apt-get install -y \
    squashfs-tools \
    curl \
    wget \
    sudo \
    python-pip \

    tox \
    git \
    apt-transport-https \
    gnupg2 \
    inetutils-ping \
    python-lzma \
    rpm \
    uuid-runtime \
    yum-utils \

    qemu \
    expect \
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

RUN mkdir -p /app/elements /app/images
ENV ELEMENTS_PATH '/app/elements'

RUN git clone -b '2.33.0' --single-branch --depth 1 https://github.com/openstack/diskimage-builder.git

# Check if all dependencies installed
RUN cd diskimage-builder && tox -e bindep;

# Make sure all the necessary dependencies are available
# running a noop command
RUN cd diskimage-builder && tox -e venv -- ramdisk-image-create --help
