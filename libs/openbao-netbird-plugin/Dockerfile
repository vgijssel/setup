FROM --platform=$BUILDPLATFORM golang:1.23.8-alpine3.21 AS builder

ARG TARGETARCH

WORKDIR /build

COPY src/go.mod src/go.sum ./
RUN go mod download

COPY src/ ./
RUN CGO_ENABLED=0 GOOS=linux GOARCH=$TARGETARCH go build -o /openbao-plugin-secrets-netbird .

FROM alpine:3.21.3
COPY --from=builder /openbao-plugin-secrets-netbird /openbao-plugin-secrets-netbird
ENTRYPOINT ["/openbao-plugin-secrets-netbird"]
