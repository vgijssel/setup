#!/usr/bin/env bats
#
# bin/openbao-plugin-pin exists to guarantee ONE property: no committed state of this repo
# has an init-container image tag beside a plugin_sha256 that describes a different build.
# These tests assert that property directly — every commit the script produces must change
# either both halves of a plugin's pin or neither — plus the idempotence the spec requires
# ("re-propagating correct pins is a no-op").
#
# The fixture is a throwaway git repo with the same shape as the real tree, and
# plugin-sha.sh is stubbed so nothing pulls an image. OPENBAO_PIN_ROOT points the script at
# it. STUB_SHA_<name> controls what the registry is pretending to hold.

setup() {
    TEST_DIR="$(cd "$(dirname "${BATS_TEST_FILENAME}")" && pwd -P)"
    REPO_ROOT="$(cd "${TEST_DIR}/../../.." && pwd -P)"
    PIN="${REPO_ROOT}/bin/openbao-plugin-pin"

    SHA_OLD_NB="44afa3f53e1424926dcaf706a9f83ef3bd7175ad4902aef0cd1cd4edc547244e"
    SHA_OLD_CF="f2517f1b5ea495b44a26a4f4fbed9cc6aee0a177a4a03eea930bd8bfbad785ac"
    SHA_NEW_NB="46c6c0e836eca5ae53045857791f1779f935bae0255e69a5bc5e86a4e293b077"
    SHA_NEW_CF="c042e51e0abc3e0d57b0b5e139fe415fc27f18c9005b37f59fe3d9c344253a09"

    FIXTURE="${BATS_TEST_TMPDIR}/repo"
    mkdir -p "${FIXTURE}/apps/secret/src/openbao" \
        "${FIXTURE}/apps/secret/src/openbao-config" \
        "${FIXTURE}/libs/openbao-netbird-plugin" \
        "${FIXTURE}/libs/openbao-cloudflare-plugin"

    make_plugin netbird "0.1.4" "${SHA_OLD_NB}"
    make_plugin cloudflare "0.1.0" "${SHA_OLD_CF}"
    write_pins

    cat >"${FIXTURE}/apps/secret/src/openbao/values.yaml" <<'YAML'
openbao:
  server:
    # A comment that must survive the rewrite.
    extraInitContainers:
      - name: plugin-netbird
        image: ghcr.io/vgijssel/setup/openbao-plugin-secrets-netbird:0.1.4
        command: [cp, /openbao-plugin-secrets-netbird, /plugins/]
      - name: plugin-cloudflare
        image: ghcr.io/vgijssel/setup/openbao-plugin-secrets-cloudflare:0.1.0
        command: [cp, /openbao-plugin-secrets-cloudflare, /plugins/]
YAML

    git -C "${FIXTURE}" init -q -b main
    git -C "${FIXTURE}" config user.email bats@example.invalid
    git -C "${FIXTURE}" config user.name bats
    git -C "${FIXTURE}" config commit.gpgsign false
    git -C "${FIXTURE}" add -A
    git -C "${FIXTURE}" commit -qm "fixture"

    export OPENBAO_PIN_ROOT="${FIXTURE}"
}

# A plugin directory: version.txt plus a plugin-sha.sh that answers from the environment
# instead of pulling an image.
make_plugin() {
    local name="$1" version="$2" sha="$3"
    local dir="${FIXTURE}/libs/openbao-${name}-plugin"

    printf '%s\n' "${version}" >"${dir}/version.txt"

    cat >"${dir}/plugin-sha.sh" <<STUB
#!/usr/bin/env bash
printf '%s' "\${STUB_SHA_${name}:-${sha}}"
STUB
    chmod +x "${dir}/plugin-sha.sh"

}

# openbao-config is a Helm chart now, so the pins are ONE values file shared by both plugins
# rather than a sha buried in each plugin's inline Terraform. Written after make_plugin has set
# up both, so it reflects whatever versions/shas they were given.
write_pins() {
    cat >"${FIXTURE}/apps/secret/src/openbao-config/values.yaml" <<YAML
# A comment that must survive the rewrite.
plugins:
  netbird:
    version: 0.1.4
    sha256: ${SHA_OLD_NB}
  cloudflare:
    version: 0.1.0
    sha256: ${SHA_OLD_CF}
YAML
}

pinned_tag() {
    name="$1" yq -r \
        '.openbao.server.extraInitContainers[] | select(.name == "plugin-" + strenv(name)) | .image' \
        "${FIXTURE}/apps/secret/src/openbao/values.yaml"
}

pinned_sha() {
    name="$1" yq -r '.plugins[strenv(name)].sha256' \
        "${FIXTURE}/apps/secret/src/openbao-config/values.yaml"
}

pinned_version() {
    name="$1" yq -r '.plugins[strenv(name)].version' \
        "${FIXTURE}/apps/secret/src/openbao-config/values.yaml"
}

# The script no longer touches git, so "nothing changed" is asserted on the FILES. A digest over
# both values files together is the honest check: it catches a half-write, which a per-file
# comparison run in sequence would not.
pins_digest() {
    cat "${FIXTURE}/apps/secret/src/openbao/values.yaml" \
        "${FIXTURE}/apps/secret/src/openbao-config/values.yaml" | shasum -a 256 | cut -d" " -f1
}
written_files() { git -C "${FIXTURE}" status --porcelain | awk '{print $2}'; }

# --- idempotence (spec: "re-propagating correct pins is a no-op") ---------------------

@test "already-correct pins leave both files byte-identical" {
    before="$(pins_digest)"
    run "${PIN}"
    [ "$status" -eq 0 ]
    [ "$(pins_digest)" = "${before}" ]
}

@test "running twice over a change is idempotent" {
    STUB_SHA_netbird="${SHA_NEW_NB}" STUB_SHA_cloudflare="${SHA_NEW_CF}" run "${PIN}"
    [ "$status" -eq 0 ]
    once="$(pins_digest)"

    STUB_SHA_netbird="${SHA_NEW_NB}" STUB_SHA_cloudflare="${SHA_NEW_CF}" run "${PIN}"
    [ "$status" -eq 0 ]
    # The point of running this task in CI: a second run over the same inputs must produce the
    # same bytes, or the task is not safe to cache.
    [ "$(pins_digest)" = "${once}" ]
}

@test "the pins land in the files without any commit" {
    head_before="$(git -C "${FIXTURE}" rev-parse HEAD)"
    STUB_SHA_netbird="${SHA_NEW_NB}" run "${PIN}"
    [ "$status" -eq 0 ]
    [ "$(pinned_sha netbird)" = "${SHA_NEW_NB}" ]
    # No git at all: release:self_upgrade owns the commit, and a second idea of what a proposal is
    # was exactly the bug that let a stranded branch read as success.
    [ "$(git -C "${FIXTURE}" rev-parse HEAD)" = "${head_before}" ]
}

# --- atomicity: tag and checksum are never committed out of step ----------------------

@test "a version bump writes the tag and the checksum together" {
    printf '0.1.5\n' >"${FIXTURE}/libs/openbao-netbird-plugin/version.txt"

    STUB_SHA_netbird="${SHA_NEW_NB}" run "${PIN}"
    [ "$status" -eq 0 ]

    # Both halves moved...
    [ "$(pinned_tag netbird)" = "ghcr.io/vgijssel/setup/openbao-plugin-secrets-netbird:0.1.5" ]
    [ "$(pinned_sha netbird)" = "${SHA_NEW_NB}" ]
    # ...including the version beside the checksum, which is what --check compares the tag to.
    [ "$(pinned_version netbird)" = "0.1.5" ]

    # ...and they moved in the SAME RUN. This is the property the whole design exists for: the
    # tag and the checksum beside it are never written apart. It now holds because one run writes
    # both files before release:self_upgrade commits anything.
    files="$(written_files)"
    [[ "$files" == *"apps/secret/src/openbao/values.yaml"* ]]
    [[ "$files" == *"apps/secret/src/openbao-config/values.yaml"* ]]
}

@test "a run never writes a tag without the checksum beside it" {
    printf '0.1.5\n' >"${FIXTURE}/libs/openbao-netbird-plugin/version.txt"
    printf '0.2.0\n' >"${FIXTURE}/libs/openbao-cloudflare-plugin/version.txt"

    STUB_SHA_netbird="${SHA_NEW_NB}" STUB_SHA_cloudflare="${SHA_NEW_CF}" run "${PIN}"
    [ "$status" -eq 0 ]

    files="$(written_files)"
    if [[ "$files" == *"apps/secret/src/openbao/values.yaml"* ]]; then
        [[ "$files" == *"openbao-config/values.yaml"* ]]
    fi
}

@test "the script writes only under apps/secret" {
    # Still worth asserting without a commit: release:self_upgrade stages everything in the
    # worktree, so a stray write here would silently join somebody else's proposal.
    printf '0.1.5\n' >"${FIXTURE}/libs/openbao-netbird-plugin/version.txt"
    STUB_SHA_netbird="${SHA_NEW_NB}" run "${PIN}"
    [ "$status" -eq 0 ]

    while read -r f; do
        [ -n "$f" ] || continue
        [[ "$f" == apps/secret/* || "$f" == libs/openbao-* ]]
    done <<<"$(written_files)"
}

# --- the writes must actually land, not silently select nothing -----------------------
#
# A yq selector that matches nothing exits 0 and edits nothing. That failure mode would
# commit one half of a pin, so the script verifies after writing rather than trusting.

@test "a values.yaml with no matching init container fails instead of half-pinning" {
    yq -i 'del(.openbao.server.extraInitContainers[] | select(.name == "plugin-netbird"))' \
        "${FIXTURE}/apps/secret/src/openbao/values.yaml"
    printf '0.1.5\n' >"${FIXTURE}/libs/openbao-netbird-plugin/version.txt"

    STUB_SHA_netbird="${SHA_NEW_NB}" run "${PIN}"
    [ "$status" -ne 0 ]
}

@test "a non-sha256 from plugin-sha.sh fails instead of pinning garbage" {
    STUB_SHA_netbird="not-a-sha" run "${PIN}"
    [ "$status" -ne 0 ]
    [ "$(pinned_sha netbird)" = "${SHA_OLD_NB}" ]
}

@test "an empty version.txt fails instead of pinning a bare repository name" {
    before="$(pins_digest)"
    : >"${FIXTURE}/libs/openbao-netbird-plugin/version.txt"
    run "${PIN}"
    [ "$status" -ne 0 ]
    [ "$(pins_digest)" = "${before}" ]
}

# --- the rewrite must not damage the surrounding YAML ---------------------------------

@test "comments survive the rewrite of both values files" {
    STUB_SHA_netbird="${SHA_NEW_NB}" run "${PIN}" 
    [ "$status" -eq 0 ]
    grep -q "A comment that must survive the rewrite" \
        "${FIXTURE}/apps/secret/src/openbao-config/values.yaml"
    grep -q "A comment that must survive the rewrite" \
        "${FIXTURE}/apps/secret/src/openbao/values.yaml"
}

# --- --check: the cross-bundle guard --------------------------------------------------
#
# The VERSION is necessarily pinned twice — the init-container image tag delivers the binary
# (openbao/values.yaml) and the catalog registers it (openbao-config/values.yaml) — because Fleet
# cannot share values between bundles and an image tag cannot come from a ConfigMap. The
# single-commit atomicity of a write therefore cannot by itself guarantee the two agree forever;
# this is the check that can, and it is the whole of `moon run release:self_upgrade_check`.

@test "--check passes on a self-consistent tree" {
    run "${PIN}" --check
    [ "$status" -eq 0 ]
}

@test "--check fails when the init-container tag and the catalog version disagree" {
    yq -i '.plugins.netbird.version = "9.9.9"' \
        "${FIXTURE}/apps/secret/src/openbao-config/values.yaml"
    run "${PIN}" --check
    [ "$status" -ne 0 ]
    [[ "$output" == *"9.9.9"* ]]
}

@test "--check fails when a checksum is not a sha256" {
    yq -i '.plugins.cloudflare.sha256 = "nope"' \
        "${FIXTURE}/apps/secret/src/openbao-config/values.yaml"
    run "${PIN}" --check
    [ "$status" -ne 0 ]
}

@test "--check neither writes nor commits" {
    before="$(pins_digest)"
    sha_before="$(pinned_sha netbird)"
    STUB_SHA_netbird="${SHA_NEW_NB}" run "${PIN}" --check
    [ "$status" -eq 0 ]
    [ "$(pins_digest)" = "${before}" ]
    # Unchanged even though the stub would have reported a different checksum — --check must not
    # consult plugin-sha.sh at all, since it has to run in CI with no docker and no network.
    [ "$(pinned_sha netbird)" = "${sha_before}" ]
}

@test "--check tolerates a pin lagging version.txt, which is a real state" {
    # A publish that has not propagated yet leaves version.txt ahead of the pins. That is the
    # normal window between publishing and merging the self_upgrade PR, not a defect.
    printf '0.1.9\n' >"${FIXTURE}/libs/openbao-netbird-plugin/version.txt"
    run "${PIN}" --check
    [ "$status" -eq 0 ]
}
