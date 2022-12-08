# NOTE: not pinning on sha here so we are pulling the right image for the right arch
FROM ubuntu:focal-20220826

ARG TARGETARCH

# Setup right locale
ENV LC_ALL="en_US.UTF-8" 
ENV LANG="en_US.UTF-8" 
ENV LANGUAGE="en_US.UTF-8"
RUN apt-get update \
    && apt-get install -y locales locales-all \
    && locale-gen en_US.UTF-8 \
    && update-locale LANG=en_US.UTF-8 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Setup the Europe/Amsterdam timezone
ENV TZ=Europe/Amsterdam
RUN apt-get update \
    && apt-get install -y tzdata \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Setup non-root user for the container
# with the ability to use passwordless sudo
RUN apt-get update \
    && apt-get install -y sudo \
    && useradd -u 1000 -m devcontainer -s /bin/bash \
    && adduser devcontainer sudo \
    && echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /project

# Install docker
RUN apt-get update \
    && apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common \
    && curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add - \
    && add-apt-repository "deb [arch=$(dpkg --print-architecture)] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
    && apt-get update \
    && apt-get install -y docker-ce-cli \
    && groupadd docker \
    && adduser devcontainer docker \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install docker compose
ENV DOCKER_COMPOSE_VERSION=2.13.0
RUN case ${TARGETARCH} in \
    "amd64")  DOCKER_COMPOSE_ARCH=x86_64 ;; \
    "arm64")  DOCKER_COMPOSE_ARCH=aarch64 ;; \
    esac \
    && curl --fail -L "https://github.com/docker/compose/releases/download/v$DOCKER_COMPOSE_VERSION/docker-compose-linux-$DOCKER_COMPOSE_ARCH" -o /usr/libexec/docker/cli-plugins/docker-compose \
    && chmod +x /usr/libexec/docker/cli-plugins/docker-compose

# Install latest git to support ssh commit signing
RUN add-apt-repository ppa:git-core/ppa -y \
    && apt-get update \
    && apt-get install -y git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install xdg-utils so we can open browser windows from inside the devcontainer!
RUN apt-get update \
    && apt-get install -y xdg-utils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install moreutils for tracking time of long running commands
USER root
RUN apt-get update \
    && apt-get install -y moreutils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install bazel dependencies 
RUN apt-get update \
    && apt-get install -y build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install aspect cli tool for bazel
ENV ASPECT_CLI_VERSION="5.0.2"
RUN case ${TARGETARCH} in \
    "amd64")  ASPECT_CLI_ARCH=amd64 ;; \
    "arm64")  ASPECT_CLI_ARCH=arm64  ;; \
    esac \
    && curl --fail -L https://github.com/aspect-build/aspect-cli/releases/download/$ASPECT_CLI_VERSION/aspect-linux_$ASPECT_CLI_ARCH --output /usr/local/bin/aspect \
    && chmod +x /usr/local/bin/aspect

# Install bazel remote for Bazel S3 caching in the CI
ENV BAZEL_REMOTE_VERSION="2.3.9"
RUN case ${TARGETARCH} in \
    "amd64")  BAZEL_REMOTE_ARCH=x86_64 ;; \
    "arm64")  BAZEL_REMOTE_ARCH=arm64  ;; \
    esac \
    && curl --fail -L https://github.com/buchgr/bazel-remote/releases/download/v$BAZEL_REMOTE_VERSION/bazel-remote-$BAZEL_REMOTE_VERSION-linux-$BAZEL_REMOTE_ARCH --output /usr/local/bin/bazel-remote \
    && chmod +x /usr/local/bin/bazel-remote

# Ensure that VSCode uses bash as the default shell
SHELL ["/bin/bash", "--login",  "-c"]

# Setup the default user of the container to devcontainer
USER devcontainer
ENV USER devcontainer

# Run some basic assertions
RUN aspect --version \
    && git --version

