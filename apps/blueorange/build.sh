#!/usr/bin/env bash
set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Building blueorange application...${NC}"
npm run build

echo -e "${BLUE}Setting up buildx builder...${NC}"
# Create or use existing builder that supports cache
if ! docker buildx inspect multiarch >/dev/null 2>&1; then
  docker buildx create --name multiarch --driver docker-container --use
else
  docker buildx use multiarch
fi

echo -e "${BLUE}Building and pushing multi-arch Docker image...${NC}"
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --cache-from type=registry,ref=ghcr.io/vgijssel/setup/blueorange-dev:cache \
  --cache-to type=registry,ref=ghcr.io/vgijssel/setup/blueorange-dev:cache,mode=max \
  --tag ghcr.io/vgijssel/setup/blueorange-dev:latest \
  --push \
  .

echo -e "${GREEN}✓ Successfully built and pushed blueorange-dev:latest${NC}"
echo -e "${GREEN}✓ Image available for linux/amd64 and linux/arm64${NC}"
