FROM golang:1.23-alpine AS builder

WORKDIR /build

COPY src/go.mod src/go.sum ./
RUN go mod download

COPY src/ ./
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /openbao-plugin-secrets-netbird .

FROM scratch
COPY --from=builder /openbao-plugin-secrets-netbird /openbao-plugin-secrets-netbird
ENTRYPOINT ["/openbao-plugin-secrets-netbird"]
