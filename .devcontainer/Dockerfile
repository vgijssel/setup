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

# Copy bin directory - Kaniko has issues with symlinks (processes alphabetically).
# We copy non-symlink files only, then recreate symlinks with RUN.
# The Hermit symlink structure is:
#   - bin/hermit           (binary - target for .pkg symlinks)
#   - bin/.*.pkg -> hermit (package symlinks pointing to hermit)
#   - bin/cmd -> .*.pkg    (command symlinks pointing to .pkg files)
#
# Copy non-symlink files from bin directory
COPY --chown=coder:coder bin/hermit bin/hermit.hcl bin/README.hermit.md /workspaces/setup/bin/
COPY --chown=coder:coder bin/activate-hermit bin/activate-hermit.fish /workspaces/setup/bin/
COPY --chown=coder:coder bin/ceph bin/chezmoi bin/cjpeg bin/claude /workspaces/setup/bin/
COPY --chown=coder:coder bin/dev-cluster bin/devcontainer bin/djpeg bin/exec /workspaces/setup/bin/
COPY --chown=coder:coder bin/help bin/html-minifier-terser bin/jpegtran bin/linstor /workspaces/setup/bin/
COPY --chown=coder:coder bin/mkdocs bin/ovn-appctl bin/postcss bin/specify /workspaces/setup/bin/
COPY --chown=coder:coder bin/supervisorctl bin/supervisord bin/svgo /workspaces/setup/bin/
COPY --chown=coder:coder bin/task-master bin/task-master-ai bin/task-master-mcp /workspaces/setup/bin/
COPY --chown=coder:coder bin/uglifyjs bin/vault-login bin/vault-shell bin/wmill /workspaces/setup/bin/
COPY --chown=coder:coder bin/internal /workspaces/setup/bin/internal

# Recreate Hermit symlinks - all .pkg files point to hermit, command symlinks point to .pkg
# This is done with RUN to avoid Kaniko's alphabetical file processing issue
RUN cd /workspaces/setup/bin && \
    # Create .pkg symlinks (all point to hermit binary)
    for pkg in ansible-11.9.0 awscli-2.27.40 bazel-6.4.0 bazel-remote-2.5.0 chainsaw-0.2.13 \
               coder-2.27.6 crossplane-2.0.2 direnv-2.37.1 docker-cli-28.4.0 flux-2.6.4 \
               fzf-0.53.0 gh-2.79.0 goss-0.4.9 gum-0.13.0 hcloud-1.57.0 helm-3.16.4 \
               jq-1.8.1 kind-0.30.0 krew-0.4.5 kubectl-1.29.6 kubectl-ko-1.13.14 \
               kubectl-rook-ceph-0.9.4 kubelogin-1.35.0 kubie-0.24.1 kustomize-5.6.0 \
               kuttl-0.22.0 moon-1.41.8 node-22.13.0 op-2.31.1 opentofu-1.10.6 \
               overmind-2.5.1 oxipng-9.1.3 packer-1.11.2 'pngquant@latest' pnpm-10.27.0 \
               python3-3.12.3 regctl-0.11.1 starship-1.23.0 tailscale-1.90.6 \
               talosctl-1.11.3 task-3.40.1 terraform-1.13.2 'trunk@latest' uv-0.9.8 \
               vals-0.38.0 vendir-0.45.0 virtctl-1.5.0 wait-for-it-2.3.0 'yq@4' zoxide-0.9.8; do \
        ln -sf hermit ".${pkg}.pkg"; \
    done && \
    # Create command symlinks (point to their respective .pkg files)
    ln -sf .ansible-11.9.0.pkg ansible ansible-config ansible-console ansible-doc \
           ansible-galaxy ansible-inventory ansible-playbook ansible-pull ansible-test ansible-vault && \
    ln -sf .awscli-2.27.40.pkg aws aws_completer && \
    ln -sf .bazel-6.4.0.pkg bazel && \
    ln -sf .bazel-remote-2.5.0.pkg bazel-remote && \
    ln -sf .chainsaw-0.2.13.pkg chainsaw && \
    ln -sf .coder-2.27.6.pkg coder && \
    ln -sf .crossplane-2.0.2.pkg crossplane && \
    ln -sf .direnv-2.37.1.pkg direnv && \
    ln -sf .docker-cli-28.4.0.pkg docker && \
    ln -sf .flux-2.6.4.pkg flux && \
    ln -sf .fzf-0.53.0.pkg fzf && \
    ln -sf .gh-2.79.0.pkg gh && \
    ln -sf .goss-0.4.9.pkg goss && \
    ln -sf .gum-0.13.0.pkg gum && \
    ln -sf .hcloud-1.57.0.pkg hcloud && \
    ln -sf .helm-3.16.4.pkg helm && \
    ln -sf .jq-1.8.1.pkg jq && \
    ln -sf .kind-0.30.0.pkg kind && \
    ln -sf .kubectl-1.29.6.pkg kubectl && \
    ln -sf .kubectl-ko-1.13.14.pkg kubectl-ko && \
    ln -sf .krew-0.4.5.pkg kubectl-krew && \
    ln -sf .kubelogin-1.35.0.pkg kubectl-oidc_login && \
    ln -sf .kubectl-rook-ceph-0.9.4.pkg kubectl-rook-ceph && \
    ln -sf .kubie-0.24.1.pkg kubie && \
    ln -sf .kustomize-5.6.0.pkg kustomize && \
    ln -sf .kuttl-0.22.0.pkg kuttl && \
    ln -sf .moon-1.41.8.pkg moon && \
    ln -sf .node-22.13.0.pkg corepack node npm npx && \
    ln -sf .op-2.31.1.pkg op && \
    ln -sf .overmind-2.5.1.pkg overmind && \
    ln -sf .oxipng-9.1.3.pkg oxipng && \
    ln -sf .packer-1.11.2.pkg packer && \
    ln -sf '.pngquant@latest.pkg' pngquant && \
    ln -sf .pnpm-10.27.0.pkg pnpm && \
    ln -sf .python3-3.12.3.pkg pip pip3 pip3.12 pydoc3 pydoc3.12 python python3 \
           python3.12 python3.12-config python3-config && \
    ln -sf .regctl-0.11.1.pkg regctl && \
    ln -sf .starship-1.23.0.pkg starship && \
    ln -sf .tailscale-1.90.6.pkg tailscale tailscaled && \
    ln -sf .talosctl-1.11.3.pkg talosctl && \
    ln -sf .task-3.40.1.pkg task && \
    ln -sf .terraform-1.13.2.pkg terraform && \
    ln -sf .opentofu-1.10.6.pkg tofu && \
    ln -sf '.trunk@latest.pkg' trunk && \
    ln -sf .uv-0.9.8.pkg uv uvx && \
    ln -sf .vals-0.38.0.pkg vals && \
    ln -sf .vendir-0.45.0.pkg vendir && \
    ln -sf .virtctl-1.5.0.pkg virtctl && \
    ln -sf .wait-for-it-2.3.0.pkg wait-for-it && \
    ln -sf '.yq@4.pkg' yq && \
    ln -sf .zoxide-0.9.8.pkg zoxide
COPY --chown=coder:coder third_party/hermit /workspaces/setup/third_party/hermit
COPY --chown=coder:coder third_party/vendir/shell /workspaces/setup/third_party/vendir/shell
COPY --chown=coder:coder libs/devenv /workspaces/setup/libs/devenv
COPY --chown=coder:coder .chezmoiroot /workspaces/setup/.chezmoiroot

# Initialize and apply chezmoi configuration using direnv
RUN bin/exec chezmoi apply --verbose

# Eager load Spaceship prompt to avoid delays on first prompt
# Passing the -i flag to zsh forces it to load as an interactive shell
RUN zsh -ic 'exit 0'

# Eager load commonly used tools for coder-devcontainer
RUN bin/exec python --version
RUN bin/exec wait-for-it --version

