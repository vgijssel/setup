# OpenTofu executor image for terraform-controller.
#
# WHY THIS EXISTS: terraform-controller's default executor image
# (oamdev/docker-terraform:1.1.5) is (a) amd64-only — "no match for platform" on
# arm64 — and (b) pinned to Terraform 1.1.5, far too old for this repo's modules
# (vault provider 5.10.1 etc.). This repo standardises on OpenTofu (hermit pins
# tofu 1.10.6), so the executor is a small multi-arch image that ships `tofu` and
# symlinks it as `terraform` — terraform-controller invokes `terraform init` /
# `terraform apply` (WD /data), which OpenTofu handles identically.
#
# Multi-arch via TARGETARCH; pinned OpenTofu version.
FROM alpine:3.21
ARG TOFU_VERSION=1.10.6
ARG TARGETARCH
RUN apk add --no-cache bash git ca-certificates curl unzip \
  && curl -fsSL -o /tmp/tofu.zip \
    "https://github.com/opentofu/opentofu/releases/download/v${TOFU_VERSION}/tofu_${TOFU_VERSION}_linux_${TARGETARCH}.zip" \
  && unzip /tmp/tofu.zip tofu -d /usr/local/bin \
  && ln -s /usr/local/bin/tofu /usr/local/bin/terraform \
  && rm /tmp/tofu.zip \
  && terraform version
WORKDIR /data
# Mirror the upstream executor: the controller overrides command/args per job
# (`terraform init`, `terraform apply …`); the container just needs to idle until then.
CMD ["tail", "-f", "/dev/null"]
