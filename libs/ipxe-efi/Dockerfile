# iPXE doesn't work on arm64 so forcing amd64
FROM --platform=linux/amd64 ubuntu:24.04

RUN apt-get update && apt-get install -y \
    git \
    gcc \
    binutils \
    make \
    perl \
    mtools \
    genisoimage \
    liblzma-dev \
    syslinux-common \
    isolinux \
    gcc-aarch64-linux-gnu \
    binutils-aarch64-linux-gnu

RUN mkdir -p /opt && cd /opt && git clone https://github.com/ipxe/ipxe.git
WORKDIR /opt/ipxe/src

# Warm the cache by building the default ipxe.efi target
RUN make CROSS=aarch64-linux-gnu- bin-arm64-efi/ipxe.efi

ADD embedded.ipxe .