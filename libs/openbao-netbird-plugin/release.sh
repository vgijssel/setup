#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REGISTRY="${REGISTRY:-ghcr.io/vgijssel/setup}"
VERSION="${VERSION:-0.1.0}"
IMAGE_REF="${REGISTRY}/openbao-plugin-secrets-netbird:${VERSION}"
SOURCE_REPO="https://github.com/vgijssel/setup"

# Resolve GHCR token: prefer GHCR_TOKEN env var, then read from OpenBao.
# The token needs write:packages scope for ghcr.io push.
if [[ -z "${GHCR_TOKEN:-}" ]]; then
    if [[ -z "${BAO_ADDR:-}" ]] || [[ -z "${BAO_TOKEN:-}" ]]; then
        echo "Error: Set GHCR_TOKEN directly, or set BAO_ADDR + BAO_TOKEN to read it from OpenBao."
        echo "  export GHCR_TOKEN=ghp_..."
        echo "  # or: eval \$(moon run secret:get_openbao_auth) && run this script"
        exit 1
    fi
    GHCR_TOKEN=$(bao kv get -field=token kv/github-packages)
fi

# Create an ephemeral Docker config with the token — never touches ~/.docker/config.json.
DOCKER_CONFIG_DIR=$(mktemp -d)
trap 'rm -rf "${DOCKER_CONFIG_DIR}"' EXIT

cat > "${DOCKER_CONFIG_DIR}/config.json" <<EOCONF
{
  "auths": {
    "ghcr.io": {
      "auth": "$(printf '%s:%s' "mvgijssel" "${GHCR_TOKEN}" | base64)"
    }
  }
}
EOCONF

export DOCKER_CONFIG="${DOCKER_CONFIG_DIR}"

echo "Building and pushing openbao-plugin-secrets-netbird..."
echo "  Target: ${IMAGE_REF}"
echo ""

docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --push \
    --label "org.opencontainers.image.source=${SOURCE_REPO}" \
    --tag "${IMAGE_REF}" \
    "${SCRIPT_DIR}"

echo ""
echo "Successfully published ${IMAGE_REF}"

# Print the SHA256 of the amd64 binary for plugin-netbird.yaml registration
echo ""
echo "Update plugin_sha256 in apps/secret/src/openbao-config/plugin-netbird.yaml:"
docker buildx build \
    --platform linux/amd64 \
    --load \
    --tag "${IMAGE_REF}-sha" \
    "${SCRIPT_DIR}" >/dev/null 2>&1
SHA256=$(docker run --rm --platform linux/amd64 "${IMAGE_REF}-sha" sha256sum /openbao-plugin-secrets-netbird | awk '{print $1}')
docker rmi "${IMAGE_REF}-sha" >/dev/null 2>&1 || true
echo "  sha256: ${SHA256}"
