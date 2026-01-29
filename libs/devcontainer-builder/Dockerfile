FROM ubuntu:noble@sha256:353675e2a41babd526e2b837d7ec780c2a05bca0164f7ea5dbbd433d21d166fc

# Labels to associate with the vgijssel/setup repository
LABEL org.opencontainers.image.source=https://github.com/vgijssel/devcontainer-builder
LABEL org.opencontainers.image.description="Container which launches devcontainers inside Coder workspaces."

# Some of these packages are duplicated in libs/devenv/files/.chezmoidata/packages.yaml
# Becaue they are needed to bootstrap chezmoi.
RUN apt-get update && apt-get install -y \
    git \
    ca-certificates \
    curl \
    ssh \
    sudo \
    locales \
    zsh \
    openssl \
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

# Add and extract hermit bundle for python3 and nodejs (ADD auto-extracts tar.gz)
ADD --chown=coder:coder libs/devcontainer-builder/dist/hermit-bundle.tar.gz /opt/hermit/
ENV PATH="/opt/hermit/bin:${PATH}"

# Create app directory for scripts
RUN mkdir -p /app && chown coder:coder /app

# Copy application files
COPY --chown=coder:coder --chmod=755 libs/devcontainer-builder/entrypoint.sh /app/entrypoint.sh
COPY --chown=coder:coder libs/devcontainer-builder/log-streamer.py /app/log-streamer.py

# Create workspaces directory
RUN mkdir -p /workspaces && chown coder:coder /workspaces

# Set default user
USER coder

# Set working directory
WORKDIR /workspaces

# Entrypoint for docker-in-docker initialization, then run our entrypoint
ENTRYPOINT [ "/usr/local/share/docker-init.sh", "/app/entrypoint.sh" ]
