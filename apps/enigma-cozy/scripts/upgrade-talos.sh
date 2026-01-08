#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STACK_DIR="$(dirname "${SCRIPT_DIR}")"
REPO_ROOT="$(cd "${STACK_DIR}/../.." && pwd)"
TALOS_IMAGE_MOON_YML="${REPO_ROOT}/libs/talos-image/moon.yml"
cd "${STACK_DIR}"

# Node definitions (control planes first, then workers)
declare -a CONTROL_PLANE_NODES=(
    "illusion:192.168.50.10"
    "the-dome:192.168.50.11"
    "the-toy-factory:192.168.50.12"
)
declare -a WORKER_NODES=(
    "here-i-am:46.224.93.115"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# META key for storing installed image digest (0x80 is in the user-defined range)
TALOS_IMAGE_DIGEST_META_KEY="0x80"

# Get installed image digest from META partition
get_installed_image_digest() {
    local ip=$1
    local digest
    digest=$(talosctl get meta "${TALOS_IMAGE_DIGEST_META_KEY}" --nodes "${ip}" --endpoints "${ip}" -o yaml 2>/dev/null | grep "value:" | sed 's/.*value: //' | tr -d '"' || echo "")
    echo "${digest}"
}

# Store image digest in META partition after successful upgrade
store_image_digest() {
    local ip=$1
    local digest=$2
    if talosctl meta write "${TALOS_IMAGE_DIGEST_META_KEY}" "${digest}" --nodes "${ip}" --endpoints "${ip}" 2>/dev/null; then
        log_info "Stored image digest in META for ${ip}"
        return 0
    else
        log_warn "Failed to store image digest in META for ${ip}"
        return 1
    fi
}

usage() {
    cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Upgrade Talos OS images on the enigma-cozy cluster nodes.

The target version is read from libs/talos-image/moon.yml metadata:
  project.metadata.dependencies["siderolabs/talos"].version

The script compares both the version tag AND the image digest (SHA) to determine
if an upgrade is needed. This allows detecting image changes even when the version
tag remains the same (e.g., when firmware or extensions are updated).

The image digest is stored in Talos META partition (key 0x80) after each successful
upgrade for future comparison.

Options:
    -h, --help          Show this help message
    --dry-run           Show what would be done without making changes
    --skip-validation   Skip post-upgrade goss validation
    --node NAME         Only upgrade a specific node (can be specified multiple times)
    --force             Skip etcd version mismatch warnings and proceed anyway

Examples:
    $(basename "$0")                     # Full rolling upgrade
    $(basename "$0") --dry-run           # Preview upgrade plan
    $(basename "$0") --node illusion     # Upgrade only the 'illusion' node
    $(basename "$0") --force             # Upgrade even with etcd version warnings
EOF
    exit 0
}

# Parse arguments
DRY_RUN=false
SKIP_VALIDATION=false
FORCE=false
declare -a SPECIFIC_NODES=()

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --skip-validation)
            SKIP_VALIDATION=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        --node)
            SPECIFIC_NODES+=("$2")
            shift 2
            ;;
        *)
            log_error "Unknown option: $1"
            usage
            ;;
    esac
done

TARGET_VERSION=$(yq '.project.metadata.dependencies["siderolabs/talos"].version' "${TALOS_IMAGE_MOON_YML}")
if [[ -z "${TARGET_VERSION}" || "${TARGET_VERSION}" == "null" ]]; then
    log_error "Could not find Talos version in ${TALOS_IMAGE_MOON_YML}"
    log_error "Expected path: project.metadata.dependencies[\"siderolabs/talos\"].version"
    exit 1
fi

TARGET_IMAGE="ghcr.io/vgijssel/setup/talos:${TARGET_VERSION}"
log_info "Target Talos version: ${TARGET_VERSION}"
log_info "Target image: ${TARGET_IMAGE}"

# Verify image exists and get its digest
log_info "Verifying target image exists..."
if ! regctl manifest head "${TARGET_IMAGE}" &> /dev/null; then
    log_error "Target image does not exist: ${TARGET_IMAGE}"
    log_error "GitHub package: https://github.com/orgs/vgijssel/packages/container/package/setup%2Ftalos"
    exit 1
fi
log_success "Target image verified"

# Get target image digest for comparison
TARGET_IMAGE_DIGEST=$(regctl image digest "${TARGET_IMAGE}" 2>/dev/null)
if [[ -z "${TARGET_IMAGE_DIGEST}" ]]; then
    log_warn "Could not get image digest for ${TARGET_IMAGE}"
    log_warn "Will fall back to version-only comparison"
else
    log_info "Target image digest: ${TARGET_IMAGE_DIGEST}"
fi

# Step 2b: Check etcd versions across control plane nodes
get_etcd_version() {
    local ip=$1
    local version
    version=$(talosctl get etcdspecs --nodes "${ip}" --endpoints "${ip}" -o yaml 2>/dev/null | grep "image:" | head -1 | sed 's/.*etcd:\(v[0-9.]*\).*/\1/' || echo "unknown")
    echo "${version}"
}

get_etcd_major_minor_version() {
    local version=$1
    # Extract major.minor (e.g., "3.5" from "v3.5.21")
    local temp="${version#v}"  # Remove leading 'v'
    echo "${temp%.*}"          # Remove last .patch
}

get_etcd_patch_version() {
    local version=$1
    # Extract patch number (e.g., "21" from "v3.5.21")
    echo "${version##*.}"
}

# Minimum etcd 3.5.x version required before upgrading to 3.6
# See: https://etcd.io/docs/v3.6/upgrades/upgrade_3_6/
ETCD_MIN_3_5_PATCH=24

echo ""
log_info "=== Checking etcd Versions ==="

declare -A ETCD_VERSIONS
declare -a ETCD_MINOR_VERSIONS=()
declare -a ETCD_35_BELOW_MIN=()
etcd_mixed_versions=false

for entry in "${CONTROL_PLANE_NODES[@]}"; do
    name="${entry%%:*}"
    ip="${entry##*:}"
    etcd_ver=$(get_etcd_version "${ip}")
    ETCD_VERSIONS["${name}"]="${etcd_ver}"

    if [[ "${etcd_ver}" != "unknown" ]]; then
        minor_ver=$(get_etcd_major_minor_version "${etcd_ver}")
        patch_ver=$(get_etcd_patch_version "${etcd_ver}")
        echo -e "  ${name} (${ip}): etcd ${etcd_ver} (series: ${minor_ver})"

        # Track unique major.minor versions (e.g., 3.5, 3.6)
        # shellcheck disable=SC2076 # We intentionally use literal matching with spaces
        if [[ ! " ${ETCD_MINOR_VERSIONS[*]} " =~ " ${minor_ver} " ]]; then
            ETCD_MINOR_VERSIONS+=("${minor_ver}")
        fi

        # Check if 3.5.x nodes meet minimum version for 3.6 upgrade
        if [[ "${minor_ver}" == "3.5" && "${patch_ver}" -lt "${ETCD_MIN_3_5_PATCH}" ]]; then
            ETCD_35_BELOW_MIN+=("${name}:${etcd_ver}")
        fi
    else
        echo -e "  ${name} (${ip}): etcd ${RED}unknown${NC}"
    fi
done

# Check for etcd version mismatch (indicates partial upgrade in progress)
# Per etcd docs: mixed 3.5/3.6 clusters ARE supported during rolling upgrades,
# but operate at the lowest common protocol version.
# See: https://etcd.io/docs/v3.6/upgrades/upgrade_3_6/
if [[ ${#ETCD_MINOR_VERSIONS[@]} -gt 1 ]]; then
    etcd_mixed_versions=true
    echo ""
    log_warn "╔════════════════════════════════════════════════════════════════════╗"
    log_warn "║            WARNING: MIXED ETCD VERSIONS DETECTED                   ║"
    log_warn "╚════════════════════════════════════════════════════════════════════╝"
    echo ""
    log_warn "Control plane nodes are running different etcd versions:"
    for name in "${!ETCD_VERSIONS[@]}"; do
        echo -e "  ${YELLOW}${name}: ${ETCD_VERSIONS[${name}]}${NC}"
    done
    echo ""
    log_info "This indicates a PARTIAL UPGRADE is in progress."
    log_info "While etcd supports mixed ${ETCD_MINOR_VERSIONS[0]}.x/${ETCD_MINOR_VERSIONS[1]}.x clusters during"
    log_info "rolling upgrades, the cluster operates at the lowest protocol version"
    log_info "and may experience degraded performance or communication issues."
    echo ""
    log_warn "NOTE: talosctl will use --force to skip etcd health checks"
    log_warn "since etcd is likely unhealthy during partial upgrade state."
    echo ""
    log_warn "RECOMMENDED ACTION:"
    log_warn "  Complete the upgrade on ALL control plane nodes promptly"
    log_warn "  to restore full cluster functionality."
    echo ""

    if [[ "${FORCE}" != "true" ]]; then
        if ! gum confirm "Continue with upgrade to complete the rolling upgrade?"; then
            log_warn "Upgrade aborted. Use --force to override."
            exit 0
        fi
    fi
fi

# Check if any 3.5.x nodes are below minimum version for 3.6 upgrade
# Note: In Talos, etcd version is bundled with Talos - users can't upgrade etcd independently.
# This warning is informational about potential risks based on etcd documentation.
if [[ ${#ETCD_35_BELOW_MIN[@]} -gt 0 ]]; then
    echo ""
    log_warn "╔════════════════════════════════════════════════════════════════════╗"
    log_warn "║          NOTE: ETCD 3.5→3.6 UPGRADE CONSIDERATIONS                 ║"
    log_warn "╚════════════════════════════════════════════════════════════════════╝"
    echo ""
    log_warn "The following nodes have etcd < v3.5.${ETCD_MIN_3_5_PATCH}:"
    for entry in "${ETCD_35_BELOW_MIN[@]}"; do
        echo -e "  ${YELLOW}${entry}${NC}"
    done
    echo ""
    log_info "Per etcd documentation, upgrading from etcd < v3.5.${ETCD_MIN_3_5_PATCH} to 3.6.x"
    log_info "may encounter issues if learner members were promoted in the past."
    log_info "In most cases, the upgrade will succeed without problems."
    echo ""
    log_info "If the upgrade fails with 'too many learner members in cluster',"
    log_info "you may need to restore from backup and retry."
    echo ""
    log_info "References:"
    log_info "  https://etcd.io/docs/v3.6/upgrades/upgrade_3_6/"
    log_info "  https://etcd.io/blog/2025/upgrade_from_3.5_to_3.6_issue/"
    echo ""
fi

# Warn about partial upgrades when upgrading single nodes
if [[ ${#SPECIFIC_NODES[@]} -gt 0 && ${#SPECIFIC_NODES[@]} -lt ${#CONTROL_PLANE_NODES[@]} ]]; then
    echo ""
    log_warn "╔════════════════════════════════════════════════════════════════════╗"
    log_warn "║                    WARNING: PARTIAL UPGRADE                        ║"
    log_warn "╚════════════════════════════════════════════════════════════════════╝"
    echo ""
    log_warn "You are upgrading only ${#SPECIFIC_NODES[@]} of ${#CONTROL_PLANE_NODES[@]} control plane nodes."
    log_warn "Major Talos upgrades often include etcd version changes (e.g., 3.5→3.6)."
    echo ""
    log_info "While etcd supports mixed-version clusters during rolling upgrades,"
    log_info "the cluster operates at the lowest common protocol version and may"
    log_info "experience degraded performance until all nodes are upgraded."
    echo ""
    log_warn "RECOMMENDATION: Complete the upgrade on ALL control plane nodes"
    log_warn "in quick succession to minimize time in mixed-version state."
    echo ""

    if [[ "${FORCE}" != "true" ]]; then
        if ! gum confirm --default=false "Continue with partial upgrade?"; then
            log_warn "Upgrade aborted. Run without --node to upgrade all nodes."
            exit 0
        fi
    else
        log_warn "Continuing due to --force flag..."
    fi
fi

# Step 3: Get current versions and build upgrade plan
echo ""
log_info "=== Current Talos Versions ==="

get_node_version() {
    local name=$1
    local ip=$2
    local version
    version=$(talosctl version --nodes "${ip}" --endpoints "${ip}" --short 2>/dev/null | grep "Tag:" | head -1 | awk '{print $2}' || echo "unknown")
    echo "${version}"
}

declare -a NODES_TO_UPGRADE=()
declare -a ALL_NODES=("${CONTROL_PLANE_NODES[@]}" "${WORKER_NODES[@]}")

for entry in "${ALL_NODES[@]}"; do
    name="${entry%%:*}"
    ip="${entry##*:}"

    # Skip if specific nodes requested and this isn't one of them
    if [[ ${#SPECIFIC_NODES[@]} -gt 0 ]]; then
        skip=true
        for specific in "${SPECIFIC_NODES[@]}"; do
            if [[ "${specific}" == "${name}" ]]; then
                skip=false
                break
            fi
        done
        if [[ "${skip}" == "true" ]]; then
            continue
        fi
    fi

    current_version=$(get_node_version "${name}" "${ip}")
    installed_digest=$(get_installed_image_digest "${ip}")

    # Check if upgrade is needed based on version AND image digest
    needs_upgrade=false
    upgrade_reason=""

    if [[ "${current_version}" != "${TARGET_VERSION}" ]]; then
        needs_upgrade=true
        upgrade_reason="version change"
    elif [[ -n "${TARGET_IMAGE_DIGEST}" && -n "${installed_digest}" && "${installed_digest}" != "${TARGET_IMAGE_DIGEST}" ]]; then
        needs_upgrade=true
        upgrade_reason="image changed (same version, different digest)"
    elif [[ -n "${TARGET_IMAGE_DIGEST}" && -z "${installed_digest}" ]]; then
        # No stored digest - could be first run or pre-digest-tracking upgrade
        # Mark for upgrade to ensure we have the latest image and store the digest
        needs_upgrade=true
        upgrade_reason="no stored digest (first digest-tracked upgrade)"
    fi

    if [[ "${needs_upgrade}" == "true" ]]; then
        if [[ "${current_version}" == "${TARGET_VERSION}" ]]; then
            echo -e "  ${name} (${ip}): ${YELLOW}${current_version}${NC} (${upgrade_reason})"
        else
            echo -e "  ${name} (${ip}): ${YELLOW}${current_version}${NC} → ${GREEN}${TARGET_VERSION}${NC}"
        fi
        NODES_TO_UPGRADE+=("${entry}")
    else
        echo -e "  ${name} (${ip}): ${GREEN}${current_version}${NC} (already at target, digest matches)"
    fi
done

if [[ ${#NODES_TO_UPGRADE[@]} -eq 0 ]]; then
    log_success "All nodes are already at target version ${TARGET_VERSION} with matching image digest"
    exit 0
fi

# Step 4: Show upgrade plan
echo ""
log_info "=== Upgrade Plan ==="
echo "The following nodes will be upgraded (one at a time):"
echo ""

cp_count=0
worker_count=0
for entry in "${NODES_TO_UPGRADE[@]}"; do
    name="${entry%%:*}"
    ip="${entry##*:}"

    # Determine if control plane or worker
    is_cp=false
    for cp_entry in "${CONTROL_PLANE_NODES[@]}"; do
        if [[ "${cp_entry}" == "${entry}" ]]; then
            is_cp=true
            break
        fi
    done

    if [[ "${is_cp}" == "true" ]]; then
        cp_count=$((cp_count + 1))
        echo "  ${cp_count}. [Control Plane] ${name} (${ip})"
    else
        worker_count=$((worker_count + 1))
        echo "  $((cp_count + worker_count)). [Worker] ${name} (${ip})"
    fi
done

echo ""
echo "Upgrade image: ${TARGET_IMAGE}"
echo ""

if [[ "${DRY_RUN}" == "true" ]]; then
    log_info "Dry run mode - no changes will be made"
    echo ""
    echo "Commands that would be executed:"
    force_flag=""
    if [[ "${etcd_mixed_versions}" == "true" ]]; then
        force_flag=" --force"
        log_warn "(--force will be used due to mixed etcd versions)"
    fi
    for entry in "${NODES_TO_UPGRADE[@]}"; do
        name="${entry%%:*}"
        ip="${entry##*:}"
        echo "  talosctl upgrade --nodes ${ip} --endpoints ${ip} --image ${TARGET_IMAGE} --preserve --stage${force_flag}"
    done
    exit 0
fi

# Step 5: Confirm with gum
if ! gum confirm "Proceed with Talos upgrade to ${TARGET_VERSION}?"; then
    log_warn "Upgrade cancelled by user"
    exit 0
fi

# Step 6: Perform rolling upgrade
echo ""
log_info "Starting rolling upgrade..."

upgrade_node() {
    local name=$1
    local ip=$2

    echo ""
    log_info "Upgrading ${name} (${ip})..."

    # Build upgrade command
    # --stage: prepare before reboot
    # --preserve: keeps ephemeral data
    # --endpoints: where to connect (same as node IP)
    # --force: skip etcd health checks (needed when etcd is unhealthy due to mixed versions)
    local upgrade_cmd="talosctl upgrade --nodes ${ip} --endpoints ${ip} --image ${TARGET_IMAGE} --preserve --stage"

    if [[ "${etcd_mixed_versions}" == "true" ]]; then
        log_warn "Using --force flag due to mixed etcd versions"
        upgrade_cmd="${upgrade_cmd} --force"
    fi

    if ! ${upgrade_cmd}; then
        log_error "Failed to initiate upgrade on ${name}"
        return 1
    fi

    log_info "Upgrade initiated on ${name}, waiting for node to reboot and become ready..."

    # Wait for node to come back up (may take several minutes)
    local max_wait=600  # 10 minutes
    local waited=0
    local interval=10

    # First wait for the node to go down (reboot)
    sleep 30

    # Then wait for it to come back
    while [[ ${waited} -lt ${max_wait} ]]; do
        if talosctl health --nodes "${ip}" --endpoints "${ip}" --wait-timeout 10s &> /dev/null; then
            break
        fi
        log_info "  Waiting for ${name} to become healthy... (${waited}s/${max_wait}s)"
        sleep "${interval}"
        waited=$((waited + interval))
    done

    if [[ ${waited} -ge ${max_wait} ]]; then
        log_error "Timeout waiting for ${name} to become healthy"
        return 1
    fi

    # Wait for Kubernetes node to be Ready
    log_info "Waiting for Kubernetes node to be Ready..."
    if ! kubectl wait --for=condition=Ready "node/${name}" --timeout=300s 2>/dev/null; then
        log_warn "Could not verify Kubernetes node readiness (node name might differ)"
    fi

    # Verify new version
    local new_version
    new_version=$(get_node_version "${name}" "${ip}")
    if [[ "${new_version}" == "${TARGET_VERSION}" ]]; then
        log_success "${name} successfully upgraded to ${new_version}"
    else
        log_error "${name} version mismatch: expected ${TARGET_VERSION}, got ${new_version}"
        return 1
    fi

    # Store image digest in META for future comparison
    if [[ -n "${TARGET_IMAGE_DIGEST}" ]]; then
        store_image_digest "${ip}" "${TARGET_IMAGE_DIGEST}"
    fi

    return 0
}

# Upgrade nodes one at a time
failed_nodes=()
for entry in "${NODES_TO_UPGRADE[@]}"; do
    name="${entry%%:*}"
    ip="${entry##*:}"

    # shellcheck disable=SC2310 # set -e is intentionally disabled in conditionals; function returns explicit exit codes
    if ! upgrade_node "${name}" "${ip}"; then
        failed_nodes+=("${name}")
        log_error "Upgrade failed for ${name}. Stopping to prevent further issues."
        log_error "You can resume by running: $0 --node ${name}"
        exit 1
    fi
done

# Step 7: Post-upgrade validation
echo ""
log_info "=== Post-Upgrade Validation ==="

# Verify all node versions
echo ""
log_info "Final Talos versions:"
all_correct=true
for entry in "${ALL_NODES[@]}"; do
    name="${entry%%:*}"
    ip="${entry##*:}"
    current_version=$(get_node_version "${name}" "${ip}")

    if [[ "${current_version}" == "${TARGET_VERSION}" ]]; then
        echo -e "  ${name} (${ip}): ${GREEN}${current_version}${NC}"
    else
        echo -e "  ${name} (${ip}): ${RED}${current_version}${NC} (expected ${TARGET_VERSION})"
        all_correct=false
    fi
done

if [[ "${all_correct}" != "true" ]]; then
    log_warn "Not all nodes are at the target version"
fi

# Run goss validation
if [[ "${SKIP_VALIDATION}" != "true" ]]; then
    echo ""
    log_info "Running cluster health validation..."
    if goss validate -s 10s -r 5m; then
        log_success "Cluster health validation passed"
    else
        log_warn "Cluster health validation failed - please investigate"
    fi
fi

# Step 8: Update all.patch.yaml with new version
echo ""
log_info "Updating all.patch.yaml with new image version..."

# Check for either the old cozystack image or the new vgijssel/setup image
CURRENT_IMAGE_LINE=$(grep -E "^\s+image: ghcr.io/(cozystack/cozystack|vgijssel/setup)/talos:" all.patch.yaml || true)
if [[ -n "${CURRENT_IMAGE_LINE}" ]]; then
    # Use sed to update the image version in place (handles both old and new image URLs)
    if sed -i.bak "s|ghcr.io/cozystack/cozystack/talos:v[0-9.]*|ghcr.io/vgijssel/setup/talos:${TARGET_VERSION}|g; s|ghcr.io/vgijssel/setup/talos:v[0-9.]*|ghcr.io/vgijssel/setup/talos:${TARGET_VERSION}|g" all.patch.yaml; then
        rm -f all.patch.yaml.bak
        log_success "Updated all.patch.yaml to use ${TARGET_IMAGE}"
        echo ""
        log_info "Don't forget to commit the updated all.patch.yaml:"
        echo "  git add all.patch.yaml && git commit -m 'chore(enigma-cozy): Update Talos image to ${TARGET_VERSION}'"
    else
        log_warn "Failed to update all.patch.yaml - please update manually"
    fi
else
    log_warn "Could not find Talos image line in all.patch.yaml - please update manually"
fi

echo ""
log_success "Talos upgrade completed successfully!"
