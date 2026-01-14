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

# Entrypoint for docker-in-docker initialization
ENTRYPOINT [ "/usr/local/share/docker-init.sh" ]

# Default command to keep the container running when started with VSCode
CMD [ "sleep", "infinity" ]

# Create workspace directory with proper ownership before switching to coder user
# This ensures coder user can write to /workspaces/setup in all container builders
# (WORKDIR creates directories as root in Kaniko/envbuilder)
RUN mkdir -p /workspaces/setup && chown coder:coder /workspaces/setup

# Set default user
USER coder

# Set working directory
WORKDIR /workspaces/setup

# Copy necessary files for chezmoi setup
COPY --chown=coder:coder .envrc /workspaces/setup/.envrc

# Workaround for Kaniko/envbuilder symlink issue:
# Direct COPY to /workspaces/setup/bin fails with:
#   "copying dir: symlink .bazel-remote-2.5.0.pkg: no such file or directory"
# Kaniko (used by envbuilder) mounts files from the git checkout. Copying a symlink
# from mounted files into the image layer fails if the symlink target isn't already
# in the layer. By first copying to /tmp/bin (outside the mount), then using RUN to
# copy to the final location, the symlinks are resolved within the container runtime.
# Note: Any directory containing symlinks added to this Dockerfile needs this workaround.
# IMPORTANT: Use /tmp/bin/. instead of /tmp/bin/* to include dotfiles (.direnv-*.pkg etc.)
COPY --chown=coder:coder bin /tmp/bin
RUN sudo mkdir -p /workspaces/setup/bin && sudo cp -r /tmp/bin/. /workspaces/setup/bin/ && sudo chown -R coder:coder /workspaces/setup/bin && rm -rf /tmp/bin

COPY --chown=coder:coder third_party/hermit /workspaces/setup/third_party/hermit
COPY --chown=coder:coder third_party/vendir/shell /workspaces/setup/third_party/vendir/shell
COPY --chown=coder:coder libs/devenv /workspaces/setup/libs/devenv
COPY --chown=coder:coder .chezmoiroot /workspaces/setup/.chezmoiroot

# Initialize and apply chezmoi configuration
RUN bin/chezmoi-wrapper apply --verbose

# Eager load Spaceship prompt to avoid delays on first prompt
RUN zsh -ic 'exit 0'

# Eager load commonly used tools
RUN bin/exec python --version
RUN bin/exec wait-for-it --version

