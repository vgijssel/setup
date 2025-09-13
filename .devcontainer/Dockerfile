FROM ubuntu:noble

# Install prerequisites for Docker-in-Docker
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    wget \
    git \
    ssh \
    busybox \
    bash \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Create devcontainer user with dynamic UID/GID
ARG USER_UID=1001
ARG USER_GID=1001
RUN groupadd --gid ${USER_GID} devcontainer \
    && useradd --uid ${USER_UID} --gid ${USER_GID} --shell /bin/bash --create-home devcontainer \
    && echo 'devcontainer ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers.d/devcontainer \
    && chmod 0440 /etc/sudoers.d/devcontainer

# Set default user
USER devcontainer

# Set working directory
WORKDIR /home/devcontainer