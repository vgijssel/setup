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
    qemu-system-x86 \
    dnsmasq \
    iptables \
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
    syslinux-common \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app/elements /app/images
ENV ELEMENTS_PATH '/app/elements'

RUN git clone -b 'bug/fix-ramdisk-building' --single-branch --depth 1 https://github.com/mvgijssel/diskimage-builder.git
RUN pip install -e diskimage-builder

ADD setup-network.sh /bin/setup-network.sh
ENTRYPOINT ["/bin/setup-network.sh"]
