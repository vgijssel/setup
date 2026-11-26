FROM --platform=$BUILDPLATFORM golang:1.25.11-alpine3.22 AS builder

ARG TARGETARCH

WORKDIR /build

COPY src/go.mod src/go.sum ./
RUN go mod download

COPY src/ ./
RUN CGO_ENABLED=0 GOOS=linux GOARCH=$TARGETARCH go build -o /openbao-plugin-secrets-cloudflare .

# The checksum OpenBao validates the plugin against, computed from the binary that is about to
# ship rather than from a rebuild of it. apps/secret pins this value; OpenBao rejects a
# registration whose checksum does not describe the binary it is handed, and says only
# "checksum mismatch". It is per-ARCH because the binary is, which is why the `digest` stage
# below is exported per platform.
RUN sha256sum /openbao-plugin-secrets-cloudflare | cut -d' ' -f1 >/plugin-sha256.txt

# The published image. Named so `--target` can select it: the LAST stage is the default target,
# and that is the digest stage below. The alpine tag deliberately differs from the netbird
# plugin's; Renovate bumps each on its own schedule.
FROM alpine:3.24.1 AS runtime
COPY --from=builder /openbao-plugin-secrets-cloudflare /openbao-plugin-secrets-cloudflare
ENTRYPOINT ["/openbao-plugin-secrets-cloudflare"]

# Digest-only, exported with `--output=type=local` as dist/digest/linux_<arch>/plugin-sha256.txt.
# `builder` runs on BUILDPLATFORM and cross-compiles, and sha256sum does not care what
# architecture its input targets, so extracting this needs no emulation for either platform.
FROM scratch AS digest
COPY --from=builder /plugin-sha256.txt /
