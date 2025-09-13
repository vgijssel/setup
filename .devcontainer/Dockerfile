FROM ubuntu:plucky

# Install required packages
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    ssh \
    busybox \
    bash \
    docker.io \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Create devcontainer user
RUN groupadd --gid 1000 devcontainer \
    && useradd --uid 1000 --gid devcontainer --shell /bin/bash --create-home devcontainer \
    && echo 'devcontainer ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers.d/devcontainer \
    && chmod 0440 /etc/sudoers.d/devcontainer

# Add devcontainer user to docker group
RUN usermod -aG docker devcontainer

# Set default user
USER devcontainer

# Set working directory
WORKDIR /home/devcontainer