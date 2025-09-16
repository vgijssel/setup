FROM ubuntu:noble

# Labels to associate with the vgijssel/setup repository
LABEL org.opencontainers.image.source=https://github.com/vgijssel/setup
LABEL org.opencontainers.image.description="Development container for the vgijssel/setup repository"

# Some of these packages are duplicated in libs/devenv/files/.chezmoidata/packages.yaml
# Becaue they are needed to bootstrap chezmoi.
RUN apt-get update && apt-get install -y \
    git \
    ca-certificates \
    curl \
    ssh \
    sudo \
    locales \
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

# Set default user
USER devcontainer

# Set working directory
WORKDIR /workspaces/setup

# Copy necessary files for chezmoi setup
COPY --chown=devcontainer:devcontainer .envrc /workspaces/setup/.envrc
COPY --chown=devcontainer:devcontainer bin /workspaces/setup/bin
COPY --chown=devcontainer:devcontainer third_party/hermit /workspaces/setup/third_party/hermit
COPY --chown=devcontainer:devcontainer third_party/vendir/shell /workspaces/setup/third_party/vendir/shell
COPY --chown=devcontainer:devcontainer libs/devenv /workspaces/setup/libs/devenv
COPY --chown=devcontainer:devcontainer .chezmoiroot /workspaces/setup/.chezmoiroot

# Initialize and apply chezmoi configuration using direnv
RUN bin/direnv allow && bin/direnv exec . bin/chezmoi apply --verbose

# NOTE: this entrypoint is made available by the `ghcr.io/devcontainers/features/docker-in-docker:2` feature
# which is specified in devcontainer.json. Building this Dockerfile directly will result in an error.
ENTRYPOINT [ "/usr/local/share/docker-init.sh" ]