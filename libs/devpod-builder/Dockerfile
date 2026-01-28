# DevPod Builder Image
# This image contains DevPod with the Kubernetes provider pre-configured,
# Python for log streaming to Coder, and an entrypoint script for workspace creation.

FROM ubuntu:24.04

# Pin versions for reproducibility
ARG DEVPOD_VERSION=0.6.15
ARG TARGETARCH=amd64

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
    python3 \
    python3-pip \
    python3-requests \
    && rm -rf /var/lib/apt/lists/*

# Install kubectl
ARG KUBECTL_VERSION=1.32.0
RUN curl -L -o /usr/local/bin/kubectl \
    "https://dl.k8s.io/release/v${KUBECTL_VERSION}/bin/linux/${TARGETARCH}/kubectl" \
    && chmod +x /usr/local/bin/kubectl

# Install DevPod
RUN curl -L -o /usr/local/bin/devpod \
    "https://github.com/loft-sh/devpod/releases/download/v${DEVPOD_VERSION}/devpod-linux-${TARGETARCH}" \
    && chmod +x /usr/local/bin/devpod

# Pre-add and configure Kubernetes provider
# Note: This happens at runtime since it requires a home directory
ENV HOME=/root

# Add Kubernetes provider at build time
RUN devpod provider add kubernetes \
    && devpod provider use kubernetes

# Create app directory
WORKDIR /app

# Copy log streaming script
COPY log-streamer.py /app/log-streamer.py
RUN chmod +x /app/log-streamer.py

# Copy entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]

# No default CMD - entrypoint runs the main workflow when no arguments provided
