FROM ubuntu:noble

# Install prerequisites for Docker-in-Docker and zsh
# TODO: maybe remove this and move to Chezmoi?
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
    && useradd --uid ${USER_UID} --gid ${USER_GID} --shell /usr/bin/zsh --create-home devcontainer \
    && echo 'devcontainer ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers.d/devcontainer \
    && chmod 0440 /etc/sudoers.d/devcontainer \
    && chsh -s /usr/bin/zsh root

# Create user-specific direnv configuration directory and copy config file (as root)
RUN mkdir -p /home/devcontainer/.config/direnv \
    && chown -R devcontainer:devcontainer /home/devcontainer/.config
COPY --chown=devcontainer:devcontainer direnv.toml /home/devcontainer/.config/direnv/direnv.toml

# Set default user
USER devcontainer

# Set working directory
WORKDIR /home/devcontainer

# # Install chezmoi binary
# RUN sh -c "$(curl -fsLS get.chezmoi.io)" -- -b /home/devcontainer/.local/bin

# # Copy the libs/devenv directory (chezmoi source) into the container
# COPY --chown=devcontainer:devcontainer libs/devenv /tmp/chezmoi-source

# # Initialize and apply chezmoi configuration
# ENV SETUP_DIR=/workspaces/setup
# RUN /home/devcontainer/.local/bin/chezmoi init --apply --source=/tmp/chezmoi-source && \
#     rm -rf /tmp/chezmoi-source