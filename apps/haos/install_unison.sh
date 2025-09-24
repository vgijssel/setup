#!/usr/bin/env bash
set -euo pipefail

# Install Unison 2.53.7 in an idempotent way

UNISON_VERSION="2.53.7"
UNISON_BIN="/usr/local/bin/unison"
UNISON_URL="https://github.com/bcpierce00/unison/releases/download/v${UNISON_VERSION}/unison-${UNISON_VERSION}-ubuntu-x86_64-static.tar.gz"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if we need sudo
needs_sudo() {
    if [[ -w "/usr/local/bin" ]]; then
        echo ""
    else
        echo "sudo"
    fi
}

# Function to print colored messages
info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Check if Unison is already installed and has the correct version
check_unison_version() {
    if [[ -f "$UNISON_BIN" ]]; then
        local current_version
        current_version=$("$UNISON_BIN" -version 2>/dev/null | head -1 || echo "")
        if echo "$current_version" | grep -q "$UNISON_VERSION"; then
            info "Unison $UNISON_VERSION is already installed"
            return 0
        else
            warn "Found different Unison version: $current_version"
            return 1
        fi
    else
        warn "Unison not found at $UNISON_BIN"
        return 1
    fi
}

# Main installation function
install_unison() {
    info "Installing Unison $UNISON_VERSION..."

    # Create temporary directory
    TEMP_DIR=$(mktemp -d -t unison.XXXXXXXXXX)
    trap "rm -rf $TEMP_DIR" EXIT

    info "Downloading Unison $UNISON_VERSION..."
    curl -sL "$UNISON_URL" -o "$TEMP_DIR/unison-${UNISON_VERSION}.tar.gz"

    info "Extracting Unison binary..."
    cd "$TEMP_DIR"
    tar -xzf "unison-${UNISON_VERSION}.tar.gz"

    # Find the unison binary (it might be in a subdirectory)
    UNISON_BINARY=$(find "$TEMP_DIR" -name "unison" -type f -executable | head -1)

    if [[ -z "$UNISON_BINARY" ]]; then
        # If no executable found, look for any file named unison
        UNISON_BINARY=$(find "$TEMP_DIR" -name "unison" -type f | head -1)
    fi

    if [[ -z "$UNISON_BINARY" ]]; then
        echo "ERROR: Could not find unison binary in extracted archive"
        exit 1
    fi

    info "Installing Unison to /usr/local/bin..."
    SUDO_CMD=$(needs_sudo)
    $SUDO_CMD install -m 755 "$UNISON_BINARY" "$UNISON_BIN"

    info "Cleaning up temporary files..."
    rm -rf "$TEMP_DIR"
    trap - EXIT
}

# Main script
main() {
    info "Checking Unison installation..."

    if check_unison_version; then
        exit 0
    fi

    install_unison

    # Verify installation
    if [[ -f "$UNISON_BIN" ]]; then
        INSTALLED_VERSION=$("$UNISON_BIN" -version 2>/dev/null | head -1)
        info "Successfully installed: $INSTALLED_VERSION"
    else
        echo "ERROR: Installation failed - Unison binary not found at $UNISON_BIN"
        exit 1
    fi
}

main "$@"