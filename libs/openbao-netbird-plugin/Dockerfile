FROM --platform=$BUILDPLATFORM golang:1.23-alpine AS builder

ARG TARGETARCH

WORKDIR /build

COPY src/go.mod src/go.sum ./
RUN go mod download

COPY src/ ./
RUN CGO_ENABLED=0 GOOS=linux GOARCH=$TARGETARCH go build -o /openbao-plugin-secrets-netbird .

FROM alpine:3.21
COPY --from=builder /openbao-plugin-secrets-netbird /openbao-plugin-secrets-netbird
ENTRYPOINT ["/openbao-plugin-secrets-netbird"]
