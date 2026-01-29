# Devcontainer Builder Image
# This image contains the @devcontainers/cli for building and running devcontainers,
# Podman for container operations (daemonless alternative to Docker),
# Python for log streaming to Coder, and an entrypoint script for workspace creation.

FROM ubuntu:24.04

# Pin versions for reproducibility
ARG NODE_VERSION=22
ARG DEVCONTAINER_CLI_VERSION=0.81.1

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js (required for devcontainer CLI)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    gnupg \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_VERSION}.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install @devcontainers/cli (pinned version)
# Note: We need python3 and build-essential for native dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    build-essential \
    && npm install -g @devcontainers/cli@${DEVCONTAINER_CLI_VERSION} \
    && apt-get purge -y build-essential \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# Install Podman and dependencies for container-in-container
# Podman is daemonless - uses a socket service instead of a persistent daemon
# fuse-overlayfs provides better storage driver support in nested containers
RUN apt-get update && apt-get install -y --no-install-recommends \
    podman \
    fuse-overlayfs \
    slirp4netns \
    uidmap \
    && rm -rf /var/lib/apt/lists/*

# Configure Podman for rootful operation in container
# Use vfs storage driver which works reliably in nested containers
RUN mkdir -p /etc/containers /var/lib/containers/storage /run/containers/storage && \
    printf '[storage]\ndriver = "vfs"\nrunroot = "/run/containers/storage"\ngraphroot = "/var/lib/containers/storage"\n' > /etc/containers/storage.conf && \
    printf '[engine]\ncgroup_manager = "cgroupfs"\nevents_logger = "file"\n' > /etc/containers/containers.conf

# Install git and Python for log streaming
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    python3-pip \
    python3-requests \
    && rm -rf /var/lib/apt/lists/*

# Set HOME and working directory
ENV HOME=/root
WORKDIR /app

# Set DOCKER_HOST to point to Podman socket for devcontainer CLI compatibility
ENV DOCKER_HOST=unix:///run/podman/podman.sock

# Create workspaces directory for devcontainer builds
RUN mkdir -p /workspaces

# Create directory for Podman socket
RUN mkdir -p /run/podman

# Copy log streaming script
COPY log-streamer.py /app/log-streamer.py
RUN chmod +x /app/log-streamer.py

# Copy entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]

# No default CMD - entrypoint runs the main workflow when no arguments provided
