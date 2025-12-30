FROM ubuntu:noble@sha256:353675e2a41babd526e2b837d7ec780c2a05bca0164f7ea5dbbd433d21d166fc

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

# Create coder user with dynamic UID/GID and set zsh as default shell
ARG USER_UID=1001
ARG USER_GID=1001
RUN groupadd --gid ${USER_GID} coder \
    && useradd --uid ${USER_UID} --gid ${USER_GID} --shell /usr/bin/zsh --create-home coder \
    && echo 'coder ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers.d/coder \
    && chmod 0440 /etc/sudoers.d/coder \
    && chsh -s /usr/bin/zsh root

# Copy and run docker-in-docker installation script
COPY --chown=coder:coder third_party/vendir/shell/docker-in-docker/install.sh /tmp/docker-in-docker-install.sh

# Install docker-in-docker with inline environment variables
RUN chmod +x /tmp/docker-in-docker-install.sh && \
    USERNAME=coder \
    USE_MOBY="true" \
    DOCKERDASHCOMPOSEVERSION="none" \
    INSTALLDOCKERCOMPOSESWITCH="false" \
    /tmp/docker-in-docker-install.sh && \
    rm /tmp/docker-in-docker-install.sh

# Entrypoint for docker-in-docker initialization
ENTRYPOINT [ "/usr/local/share/docker-init.sh" ]

# Default command to keep the container running when started with VSCode
CMD [ "sleep", "infinity" ]

# Set default user
USER coder

# Set working directory
WORKDIR /workspaces/setup

# Copy necessary files for chezmoi setup
COPY --chown=coder:coder .envrc /workspaces/setup/.envrc
COPY --chown=coder:coder bin /workspaces/setup/bin
COPY --chown=coder:coder third_party/hermit /workspaces/setup/third_party/hermit
COPY --chown=coder:coder third_party/vendir/shell /workspaces/setup/third_party/vendir/shell
COPY --chown=coder:coder libs/devenv /workspaces/setup/libs/devenv
COPY --chown=coder:coder .chezmoiroot /workspaces/setup/.chezmoiroot

# Initialize and apply chezmoi configuration using direnv
RUN bin/run chezmoi apply --verbose

# Eager load Spaceship prompt to avoid delays on first prompt
# Passing the -i flag to zsh forces it to load as an interactive shell
RUN zsh -ic 'exit 0'

# Eager load commonly used tools for coder-devcontainer
RUN bin/run python --version
RUN bin/run wait-for-it --version

# Remove all the files so Coder can clone the repository here.
# If there are files inside the folder the clone will fail.
RUN rm -rf /workspaces/setup

# Ensure the /workspaces/setup directory exists and is owned by coder
RUN mkdir -p /workspaces/setup && chown coder:coder /workspaces/setup