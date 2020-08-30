ARG IMAGE_SHA_TAG=latest
ARG DOCKER_REGISTRY
FROM ${DOCKER_REGISTRY}/base-image:${IMAGE_SHA_TAG}

# Copied from https://github.com/j8r/dockerfiles/blob/master/systemd/ubuntu/20.04.Dockerfile
# Install dependencies to run systemd inside of docker
RUN apt-get update \
  && apt-get install -y systemd systemd-sysv systemd-container \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN cd /lib/systemd/system/sysinit.target.wants/ \
  && ls | grep -v systemd-tmpfiles-setup | xargs rm -f $1

RUN rm -f /lib/systemd/system/multi-user.target.wants/* \
  /etc/systemd/system/*.wants/* \
  /lib/systemd/system/local-fs.target.wants/* \
  /lib/systemd/system/sockets.target.wants/*udev* \
  /lib/systemd/system/sockets.target.wants/*initctl* \
  /lib/systemd/system/basic.target.wants/* \
  /lib/systemd/system/anaconda.target.wants/* \
  /lib/systemd/system/plymouth* \
  /lib/systemd/system/systemd-update-utmp*

VOLUME [ "/sys/fs/cgroup" ]

CMD ["/lib/systemd/systemd"]

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
