# OpenBao bring-up image for the Task 2.4 KubeVela Workflow.
#
# WHY THIS EXISTS: the one-off OpenBao bootstrap (seed the static seal key ->
# `bao operator init` -> store recovery/root keys to 1Password -> mint a temporary
# admin token the `vault` Provider reads) must run INSIDE the secret child, next to
# OpenBao (SPEC §3.2/§4). That needs the OpenBao CLI (`bao`), the 1Password CLI
# (`op`, driven by OP_SERVICE_ACCOUNT_TOKEN — no interactive signin), `kubectl`
# (create the seal / provider-credentials Secrets in-cluster), and `jq`. No public
# image bundles these, so build a small pinned multi-arch one.
#
# All tools pinned to the repo's hermit versions (CLAUDE.md); multi-arch via
# TARGETARCH. The seal key is generated from /dev/urandom (no openssl dependency).
FROM alpine:3.21

ARG TARGETARCH
ARG BAO_VERSION=2.5.5
ARG KUBECTL_VERSION=1.29.6
ARG OP_VERSION=2.31.1
ARG JQ_VERSION=1.8.2

RUN apk add --no-cache bash ca-certificates curl unzip \
  # OpenBao CLI
  && curl -fsSL -o /tmp/bao.tar.gz \
    "https://github.com/openbao/openbao/releases/download/v${BAO_VERSION}/bao_${BAO_VERSION}_linux_${TARGETARCH}.tar.gz" \
  && tar -xzf /tmp/bao.tar.gz -C /usr/local/bin bao \
  # kubectl
  && curl -fsSL -o /usr/local/bin/kubectl \
    "https://dl.k8s.io/release/v${KUBECTL_VERSION}/bin/linux/${TARGETARCH}/kubectl" \
  # 1Password CLI
  && curl -fsSL -o /tmp/op.zip \
    "https://cache.agilebits.com/dist/1P/op2/pkg/v${OP_VERSION}/op_linux_${TARGETARCH}_v${OP_VERSION}.zip" \
  && unzip -o /tmp/op.zip op -d /usr/local/bin \
  # jq
  && curl -fsSL -o /usr/local/bin/jq \
    "https://github.com/jqlang/jq/releases/download/jq-${JQ_VERSION}/jq-linux-${TARGETARCH}" \
  && chmod +x /usr/local/bin/kubectl /usr/local/bin/jq /usr/local/bin/op /usr/local/bin/bao \
  && rm -f /tmp/bao.tar.gz /tmp/op.zip \
  && bao version && kubectl version --client && op --version && jq --version

# The bring-up script is mounted from a ConfigMap at run time (workflow step), so the
# image carries only the toolchain. Idle by default; the Job overrides command/args.
WORKDIR /work
CMD ["bash", "-lc", "sleep infinity"]
