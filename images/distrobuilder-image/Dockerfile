# trunk-ignore-all(trivy/DS002)
# trunk-ignore-all(trivy/DS026)

# Copied from https://github.com/f-bn/containers-images/blob/main/distrobuilder/Dockerfile
# --- Build stage ---
FROM docker.io/golang:1.22.7 AS build

ARG TARGETOS
ARG TARGETARCH
ARG VERSION=3.1
    
ENV GOOS=${TARGETOS}
ENV GOARCH=${TARGETARCH}
ENV GO111MODULE=on
    
WORKDIR /build
    
RUN git clone --single-branch --branch distrobuilder-${VERSION} https://github.com/lxc/distrobuilder.git /build
RUN set -ex ; \
    mkdir -p /build/bin ; \
    gofmt -s -w . ; \
    go build -v -ldflags="-s -w" -o $PWD/bin ./... ;
    
# --- Final stage ---
FROM docker.io/ubuntu:24.04
    
COPY --from=build --chmod=755 /build/bin/distrobuilder /usr/bin/distrobuilder
    
RUN set -ex ; \
    export DEBIAN_FRONTEND=noninteractive ; \
    apt update && \
    apt install -y --no-install-recommends \
    btrfs-progs \
    bzip2 \
    debootstrap \
    dosfstools \
    gdisk \
    gzip \
    qemu-utils \
    rsync \
    squashfs-tools \
    tar \
    udev \
    xz-utils \
    ca-certificates \
    p7zip-full \
    gpg \
    zstd ; \
    apt clean all ; \
    rm -rf /var/lib/apt/lists/*
    
WORKDIR /build
    
ENTRYPOINT [ "/usr/bin/distrobuilder" ]