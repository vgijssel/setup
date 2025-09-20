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

# Copy and run docker-in-docker installation script
COPY --chown=devcontainer:devcontainer third_party/vendir/shell/docker-in-docker/install.sh /tmp/docker-in-docker-install.sh

# Install docker-in-docker
# Using environment variables expected by the script
ENV USERNAME=devcontainer
ENV USE_MOBY="true"
ENV DOCKERDASHCOMPOSEVERSION="none"
ENV INSTALLDOCKERCOMPOSESWITCH="false"

RUN chmod +x /tmp/docker-in-docker-install.sh && \
    /tmp/docker-in-docker-install.sh && \
    rm /tmp/docker-in-docker-install.sh

# Entrypoint for docker-in-docker initialization
ENTRYPOINT [ "/usr/local/share/docker-init.sh" ]

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

# Remove all the files so Coder can clone the repository here.
# If there are files inside the folder the clone will fail.
RUN rm -rf /workspaces/setup

# Ensure the /workspaces/setup directory exists and is owned by devcontainer
RUN mkdir -p /workspaces/setup && chown devcontainer:devcontainer /workspaces/setup

# Setup SSH known hosts for GitHub
COPY --chown=devcontainer:devcontainer .devcontainer/ssh_known_hosts /home/devcontainer/.ssh/known_hosts
RUN chmod 600 /home/devcontainer/.ssh/known_hosts
