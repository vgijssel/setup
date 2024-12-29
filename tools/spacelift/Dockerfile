# trunk-ignore-all(checkov/CKV_DOCKER_2)
# trunk-ignore-all(checkov/CKV_DOCKER_7)
# trunk-ignore-all(trivy/DS026)
# trunk-ignore(trivy/DS001)
FROM ghcr.io/spacelift-io/runner-ansible:latest AS spacelift

LABEL org.opencontainers.image.source=https://github.com/vgijssel/setup

USER root

RUN apk add --no-cache tailscale

RUN echo https://downloads.1password.com/linux/alpinelinux/stable/ >> /etc/apk/repositories && \
    wget https://downloads.1password.com/linux/keys/alpinelinux/support@1password.com-61ddfc31.rsa.pub -P /etc/apk/keys && \
    apk update && \
    apk add 1password-cli && \
    op --version

COPY bin/ /usr/local/bin/
COPY .ssh/ /home/spacelift/.ssh/

# Let tailscale/d use default socket location
RUN mkdir -p /home/spacelift/.local/share/tailscale /var/run/tailscale && chown spacelift:spacelift /home/spacelift/.local/share/tailscale /var/run/tailscale

USER spacelift