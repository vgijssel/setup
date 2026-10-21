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

    cat >"${FIXTURE}/apps/secret/src/openbao-config/plugin-${name}.yaml" <<YAML
# A comment that must survive the rewrite.
apiVersion: opentofu.upbound.io/v1beta1
kind: Workspace
metadata:
  name: ${name}-plugin-config
spec:
  forProvider:
    source: Inline
    vars:
      - key: plugin_sha256
        value: ${sha}
    module: |
      # A heredoc block that must survive the rewrite.
      resource "null_resource" "x" {}
YAML
}

pinned_tag() {
    name="$1" yq -r \
        '.openbao.server.extraInitContainers[] | select(.name == "plugin-" + strenv(name)) | .image' \
        "${FIXTURE}/apps/secret/src/openbao/values.yaml"
}

pinned_sha() {
    yq -r '.spec.forProvider.vars[] | select(.key == "plugin_sha256") | .value' \
        "${FIXTURE}/apps/secret/src/openbao-config/plugin-$1.yaml"
}

commit_count() { git -C "${FIXTURE}" rev-list --count HEAD; }

# --- idempotence (spec: "re-propagating correct pins is a no-op") ---------------------

@test "already-correct pins produce no commit" {
    run "${PIN}"
    [ "$status" -eq 0 ]
    [ "$(commit_count)" -eq 1 ]
    [[ "$output" == *"nothing to commit"* ]]
}

@test "running twice over a change produces exactly one commit" {
    STUB_SHA_netbird="${SHA_NEW_NB}" STUB_SHA_cloudflare="${SHA_NEW_CF}" run "${PIN}"
    [ "$status" -eq 0 ]
    [ "$(commit_count)" -eq 2 ]

    STUB_SHA_netbird="${SHA_NEW_NB}" STUB_SHA_cloudflare="${SHA_NEW_CF}" run "${PIN}"
    [ "$status" -eq 0 ]
    [ "$(commit_count)" -eq 2 ]
}

@test "--no-commit writes the files but makes no commit" {
    STUB_SHA_netbird="${SHA_NEW_NB}" run "${PIN}" --no-commit
    [ "$status" -eq 0 ]
    [ "$(commit_count)" -eq 1 ]
    [ "$(pinned_sha netbird)" = "${SHA_NEW_NB}" ]
}

# --- atomicity: tag and checksum are never committed out of step ----------------------

@test "a version bump commits the tag and the checksum together" {
    printf '0.1.5\n' >"${FIXTURE}/libs/openbao-netbird-plugin/version.txt"
    git -C "${FIXTURE}" commit -qam "bump netbird to 0.1.5"

    STUB_SHA_netbird="${SHA_NEW_NB}" run "${PIN}"
    [ "$status" -eq 0 ]

    # Both halves moved...
    [ "$(pinned_tag netbird)" = "ghcr.io/vgijssel/setup/openbao-plugin-secrets-netbird:0.1.5" ]
    [ "$(pinned_sha netbird)" = "${SHA_NEW_NB}" ]

    # ...and they moved in the SAME commit. This is the property the whole design exists for:
    # any commit that touches the tag must also touch the checksum beside it.
    files="$(git -C "${FIXTURE}" show --name-only --format= HEAD)"
    [[ "$files" == *"apps/secret/src/openbao/values.yaml"* ]]
    [[ "$files" == *"apps/secret/src/openbao-config/plugin-netbird.yaml"* ]]
}

@test "no commit ever changes a tag without the checksum beside it" {
    printf '0.1.5\n' >"${FIXTURE}/libs/openbao-netbird-plugin/version.txt"
    printf '0.2.0\n' >"${FIXTURE}/libs/openbao-cloudflare-plugin/version.txt"
    git -C "${FIXTURE}" commit -qam "bump both"

    STUB_SHA_netbird="${SHA_NEW_NB}" STUB_SHA_cloudflare="${SHA_NEW_CF}" run "${PIN}"
    [ "$status" -eq 0 ]

    # Walk every commit the script produced and assert the invariant holds in each.
    for rev in $(git -C "${FIXTURE}" rev-list HEAD); do
        files="$(git -C "${FIXTURE}" show --name-only --format= "${rev}")"
        if [[ "$files" == *"apps/secret/src/openbao/values.yaml"* ]]; then
            [[ "$files" == *"openbao-config/plugin-netbird.yaml"* ]]
            [[ "$files" == *"openbao-config/plugin-cloudflare.yaml"* ]]
        fi
    done
}

@test "the propagation commit touches only apps/secret so it cannot route to a package" {
    STUB_SHA_netbird="${SHA_NEW_NB}" run "${PIN}"
    [ "$status" -eq 0 ]

    while read -r f; do
        [ -n "$f" ] || continue
        [[ "$f" == apps/secret/* ]]
    done <<<"$(git -C "${FIXTURE}" show --name-only --format= HEAD)"
}

@test "the propagation commit is typed chore so it is not releasable" {
    STUB_SHA_netbird="${SHA_NEW_NB}" run "${PIN}"
    [ "$status" -eq 0 ]
    subject="$(git -C "${FIXTURE}" log -1 --format=%s)"
    [[ "$subject" == chore* ]]
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
    [ "$(commit_count)" -eq 1 ]
}

@test "a non-sha256 from plugin-sha.sh fails instead of pinning garbage" {
    STUB_SHA_netbird="not-a-sha" run "${PIN}"
    [ "$status" -ne 0 ]
    [ "$(commit_count)" -eq 1 ]
    [ "$(pinned_sha netbird)" = "${SHA_OLD_NB}" ]
}

@test "an empty version.txt fails instead of pinning a bare repository name" {
    : >"${FIXTURE}/libs/openbao-netbird-plugin/version.txt"
    run "${PIN}"
    [ "$status" -ne 0 ]
    [ "$(commit_count)" -eq 1 ]
}

# --- the rewrite must not damage the surrounding YAML ---------------------------------

@test "comments and the inline module heredoc survive the rewrite" {
    STUB_SHA_netbird="${SHA_NEW_NB}" run "${PIN}" --no-commit
    [ "$status" -eq 0 ]
    grep -q "A comment that must survive the rewrite" \
        "${FIXTURE}/apps/secret/src/openbao-config/plugin-netbird.yaml"
    grep -q "A heredoc block that must survive the rewrite" \
        "${FIXTURE}/apps/secret/src/openbao-config/plugin-netbird.yaml"
    grep -q "A comment that must survive the rewrite" \
        "${FIXTURE}/apps/secret/src/openbao/values.yaml"
}
