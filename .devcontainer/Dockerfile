FROM ubuntu:noble

# Install prerequisites for Docker-in-Docker and zsh
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    wget \
    git \
    ssh \
    busybox \
    bash \
    sudo \
    direnv \
    locales \
    zsh \
    && rm -rf /var/lib/apt/lists/*

# Configure locale
RUN locale-gen en_US.UTF-8
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

# Create devcontainer user with dynamic UID/GID and set zsh as default shell
ARG USER_UID=1001
ARG USER_GID=1001
RUN groupadd --gid ${USER_GID} devcontainer \
    && useradd --uid ${USER_UID} --gid ${USER_GID} --shell /bin/zsh --create-home devcontainer \
    && echo 'devcontainer ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers.d/devcontainer \
    && chmod 0440 /etc/sudoers.d/devcontainer \
    && chsh -s /bin/zsh root

# Create user-specific direnv configuration directory and copy config file (as root)
RUN mkdir -p /home/devcontainer/.config/direnv \
    && chown -R devcontainer:devcontainer /home/devcontainer/.config
COPY --chown=devcontainer:devcontainer direnv.toml /home/devcontainer/.config/direnv/direnv.toml

# Set default user
USER devcontainer

# Set working directory
WORKDIR /home/devcontainer