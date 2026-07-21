# Native-arch build of kubevela/terraform-controller from its pinned source tag.
#
# WHY THIS EXISTS: upstream's own Dockerfile hardcodes `GOARCH=amd64`, so every
# architecture in oamdev/terraform-controller's published multi-arch manifest is
# actually an amd64 binary. On an arm64 host the "arm64" image dies with
# "exec format error", and the amd64 image cannot be qemu-emulated either — this
# Go 1.17 binary hits the well-known Go-on-qemu `lfstack.push invalid packing`
# fatal error. So on arm64 dev substrate we compile the pinned source for the
# target arch ourselves. On amd64 (incl. real prod) the upstream image is used
# directly and this build is not needed.
#
# Pinned by the release tag (TF_CTRL_REF); reproducible, no source vendoring.
FROM golang:1.17-alpine AS builder
ARG TF_CTRL_REF=v0.8.0
ARG TARGETARCH
RUN apk add --no-cache git
RUN git clone --depth 1 --branch "${TF_CTRL_REF}" https://github.com/kubevela/terraform-controller /src
WORKDIR /src
RUN CGO_ENABLED=0 GOOS=linux GOARCH="${TARGETARCH}" GO111MODULE=on go build -a -o manager main.go

FROM alpine
# git is required by the controller to fetch remote Terraform modules at runtime.
RUN apk add --no-cache git
COPY --from=builder /src/manager /manager
ENTRYPOINT ["/manager"]
