#!/usr/bin/env bats
#
# libs/release/self-upgrade.sh must leave exactly ONE outstanding proposal, and a proposal is TWO
# things: a branch AND an open PR. They come apart in practice — a `gh pr create` that fails after
# the push (a PAT lacking `Pull requests: write` does precisely this, observed 2026-10-22), or a
# human closing the PR unmerged — and the first version of this script treated a matching branch
# as proof that a proposal existed. A stranded branch was then skipped forever while the run
# reported success, which is the same fail-open-to-skipping shape as a registry probe reading
# ambiguity as absence.
#
# `gh` and `plugin-sha.sh` are stubbed and the remote is a local bare repo, so nothing here needs
# a network, docker, or GitHub.

setup() {
    TEST_DIR="$(cd "$(dirname "${BATS_TEST_FILENAME}")" && pwd -P)"
    REPO_ROOT="$(cd "${TEST_DIR}/../../.." && pwd -P)"

    SHA_NB="46c6c0e836eca5ae53045857791f1779f935bae0255e69a5bc5e86a4e293b077"
    SHA_CF="c042e51e0abc3e0d57b0b5e139fe415fc27f18c9005b37f59fe3d9c344253a09"

    WORK="${BATS_TEST_TMPDIR}/work"
    ORIGIN="${BATS_TEST_TMPDIR}/origin.git"
    export GH_LOG="${BATS_TEST_TMPDIR}/gh.log"
    export PR_STATE_FILE="${BATS_TEST_TMPDIR}/pr.state"
    : >"${GH_LOG}"

    mkdir -p "${WORK}/apps/secret/src/openbao" \
        "${WORK}/apps/secret/src/openbao-config" \
        "${WORK}/libs/openbao-netbird-plugin" \
        "${WORK}/libs/openbao-cloudflare-plugin" \
        "${WORK}/libs/release" \
        "${WORK}/bin"

    cp "${REPO_ROOT}/libs/release/self-upgrade.sh" "${WORK}/libs/release/"
    cp "${REPO_ROOT}/bin/openbao-plugin-pin" "${WORK}/bin/"

    make_plugin netbird 0.1.4 "${SHA_NB}"
    make_plugin cloudflare 0.1.0 "${SHA_CF}"

    # Committed pins deliberately STALE, so every run computes a change and has something to
    # propose. The 0000… checksums are placeholders the stubs will overwrite.
    cat >"${WORK}/apps/secret/src/openbao-config/values.yaml" <<YAML
plugins:
  netbird:
    version: 0.1.4
    sha256: 0000000000000000000000000000000000000000000000000000000000000000
  cloudflare:
    version: 0.1.0
    sha256: 1111111111111111111111111111111111111111111111111111111111111111
YAML

    cat >"${WORK}/apps/secret/src/openbao/values.yaml" <<'YAML'
openbao:
  server:
    extraInitContainers:
      - name: plugin-netbird
        image: ghcr.io/vgijssel/setup/openbao-plugin-secrets-netbird:0.1.4
      - name: plugin-cloudflare
        image: ghcr.io/vgijssel/setup/openbao-plugin-secrets-cloudflare:0.1.0
YAML

    git init -q --bare "${ORIGIN}"
    git -C "${WORK}" init -q -b main
    git -C "${WORK}" config user.email bats@example.invalid
    git -C "${WORK}" config user.name bats
    git -C "${WORK}" config commit.gpgsign false
    git -C "${WORK}" remote add origin "${ORIGIN}"
    git -C "${WORK}" add -A
    git -C "${WORK}" commit -qm fixture
    git -C "${WORK}" push -q origin main

    # A stub gh that reports whatever PR_STATE_FILE says, and records every call.
    STUB="${BATS_TEST_TMPDIR}/stub"
    mkdir -p "${STUB}"
    cat >"${STUB}/gh" <<'STUB'
#!/usr/bin/env bash
echo "gh $*" >>"${GH_LOG}"
case "$*" in
*"pr view"*"--json state"*) [ -s "${PR_STATE_FILE}" ] && cat "${PR_STATE_FILE}" || exit 1 ;;
*"pr view"*"--json url"*)    echo "https://example.invalid/pr/1" ;;
*"pr create"*)               echo OPEN >"${PR_STATE_FILE}"; echo "https://example.invalid/pr/1" ;;
esac
STUB
    chmod +x "${STUB}/gh"
    PATH="${STUB}:${PATH}"
    export PATH
}

make_plugin() {
    local name="$1" version="$2" sha="$3"
    local dir="${WORK}/libs/openbao-${name}-plugin"
    printf '%s\n' "${version}" >"${dir}/version.txt"
    cat >"${dir}/plugin-sha.sh" <<STUB
#!/usr/bin/env bash
printf '%s' "${sha}"
STUB
    chmod +x "${dir}/plugin-sha.sh"
}

run_self_upgrade() {
    cd "${WORK}" || return 1
    run env SELF_UPGRADE_ROOT="${WORK}" ./libs/release/self-upgrade.sh
}

prs_created() { grep -c 'pr create' "${GH_LOG}" || true; }
remote_has_branch() {
    git -C "${WORK}" ls-remote --exit-code --heads origin chore/openbao-plugin-pins >/dev/null 2>&1
}

# --- the happy path -------------------------------------------------------------------

@test "a first run pushes the branch and opens one PR" {
    run_self_upgrade
    [ "$status" -eq 0 ]
    remote_has_branch
    [ "$(prs_created)" -eq 1 ]
}

@test "a second run with the same pins and an open PR changes nothing" {
    run_self_upgrade
    [ "$status" -eq 0 ]
    run_self_upgrade
    [ "$status" -eq 0 ]
    [ "$(prs_created)" -eq 1 ]
    [[ "$output" == *"already proposes exactly these pins"* ]]
}

# --- the regression: a branch with no PR is NOT a proposal ------------------------------

@test "a stranded branch (pushed, PR creation failed) still gets a PR" {
    # Reproduce the real state: branch on the remote carrying the correct pins, no PR, because
    # `gh pr create` was rejected by a PAT without `Pull requests: write`.
    run_self_upgrade
    [ "$status" -eq 0 ]
    remote_has_branch
    : >"${PR_STATE_FILE}" # the PR does not exist
    : >"${GH_LOG}"

    run_self_upgrade
    [ "$status" -eq 0 ]
    # The whole point: it must NOT read "branch is correct" as "a proposal exists".
    [ "$(prs_created)" -eq 1 ]
    [[ "$output" == *"already carries these pins; not re-pushing"* ]]
}

@test "a PR closed unmerged is re-opened by the next run" {
    # design.md and the PR body both promise this. Before the fix they were wrong.
    run_self_upgrade
    [ "$status" -eq 0 ]
    echo CLOSED >"${PR_STATE_FILE}"
    : >"${GH_LOG}"

    run_self_upgrade
    [ "$status" -eq 0 ]
    [ "$(prs_created)" -eq 1 ]
}

@test "a stranded branch is not re-pushed, only proposed" {
    run_self_upgrade
    before="$(git -C "${WORK}" rev-parse refs/remotes/origin/chore/openbao-plugin-pins 2>/dev/null ||
        git --git-dir="${ORIGIN}" rev-parse chore/openbao-plugin-pins)"
    : >"${PR_STATE_FILE}"

    run_self_upgrade
    [ "$status" -eq 0 ]
    after="$(git --git-dir="${ORIGIN}" rev-parse chore/openbao-plugin-pins)"
    # Identical content must not produce a new commit object on the remote — that would churn the
    # PR and re-trigger CI for nothing.
    [ "${before}" = "${after}" ]
}

# --- nothing to propose ----------------------------------------------------------------

@test "pins already correct on main produce no branch and no PR" {
    # Make the committed pins already describe what the stubs report.
    sha_nb="${SHA_NB}" yq -i '.plugins.netbird.sha256 = strenv(sha_nb)' \
        "${WORK}/apps/secret/src/openbao-config/values.yaml"
    sha_cf="${SHA_CF}" yq -i '.plugins.cloudflare.sha256 = strenv(sha_cf)' \
        "${WORK}/apps/secret/src/openbao-config/values.yaml"
    git -C "${WORK}" commit -qam "pins already correct"
    git -C "${WORK}" push -q origin main

    run_self_upgrade
    [ "$status" -eq 0 ]
    [ "$(prs_created)" -eq 0 ]
    ! remote_has_branch
}
