#!/usr/bin/env bash
set -euo pipefail

# Bootstrap 1Password Connect operator secrets in Kubernetes
# This script creates the required secrets for the 1Password operator

CREDENTIALS_REF=""
TOKEN_REF=""

usage() {
    cat <<EOF
Usage: $(basename "$0") --credentials-ref <ref> --token-ref <ref>

Bootstrap 1Password Connect operator secrets in a Kubernetes cluster.

Required arguments:
  -c, --credentials-ref  1Password secret reference for credentials JSON
                         Example: op://setup-coder-prod/coder-prod Credentials File/1password-credentials.json
  -t, --token-ref        1Password secret reference for operator token
                         Example: op://setup-coder-prod/kzsqg7xbgiz7jbvxksugadymne/credential

Options:
  -h, --help             Show this help message

Example:
  $(basename "$0") \\
    --credentials-ref "op://setup-coder-prod/coder-prod Credentials File/1password-credentials.json" \\
    --token-ref "op://setup-coder-prod/kzsqg7xbgiz7jbvxksugadymne/credential"
EOF
}

log() {
    echo "==> $1"
}

error() {
    echo "ERROR: $1" >&2
    exit 1
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -c|--credentials-ref)
            CREDENTIALS_REF="$2"
            shift 2
            ;;
        -t|--token-ref)
            TOKEN_REF="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            ;;
    esac
done

# Validate required arguments
if [[ -z "${CREDENTIALS_REF}" ]]; then
    error "Missing required argument: --credentials-ref"
fi

if [[ -z "${TOKEN_REF}" ]]; then
    error "Missing required argument: --token-ref"
fi

# Check for required tools
command -v op >/dev/null 2>&1 || error "op (1Password CLI) is not installed"
command -v kubectl >/dev/null 2>&1 || error "kubectl is not installed"

# Create namespace
log "Creating 1password namespace..."
kubectl create namespace 1password 2>/dev/null || true

# Read and apply credentials secret
log "Reading credentials from 1Password..."
CREDS=$(op read "${CREDENTIALS_REF}" | base64)

log "Deleting existing 1password-credentials secret (if any)..."
kubectl delete secret 1password-credentials --namespace=1password --ignore-not-found

log "Creating 1password-credentials secret..."
kubectl create secret generic 1password-credentials \
    --namespace=1password \
    --from-literal=1password-credentials.json="${CREDS}"

# Read and apply operator token secret
log "Reading operator token from 1Password..."
TOKEN=$(op read "${TOKEN_REF}")

log "Deleting existing 1password-operator-token secret (if any)..."
kubectl delete secret 1password-operator-token --namespace=1password --ignore-not-found

log "Creating 1password-operator-token secret..."
kubectl create secret generic 1password-operator-token \
    --namespace=1password \
    --from-literal=token="${TOKEN}"

log "1Password operator secrets bootstrapped successfully!"
