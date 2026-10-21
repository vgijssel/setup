#!/usr/bin/env bats
#
# bin/registry-tag-exists is the one piece of this pipeline whose wrong answer is SILENT:
# read an ambiguous probe as "absent" and the next push re-tags an existing image, which
# invalidates every plugin_sha256 pinned against the old digest and surfaces only as a bare
# "checksum mismatch" from OpenBao's plugin catalog, long after the fact. So it gets tests.
#
# regctl is stubbed earlier on PATH, driven by STUB_MODE, so the real stderr strings
# captured in task 1.4 are replayed without touching a network.

setup() {
    TEST_DIR="$(cd "$(dirname "${BATS_TEST_FILENAME}")" && pwd -P)"
    REPO_ROOT="$(cd "${TEST_DIR}/../../.." && pwd -P)"
    PROBE="${REPO_ROOT}/bin/registry-tag-exists"

    # A stub regctl earlier on PATH than the hermit-managed one. Each mode reproduces a
    # verbatim regctl 0.11.1 response (design.md, task 1.4).
    STUB_DIR="${BATS_TEST_TMPDIR}/stub"
    mkdir -p "${STUB_DIR}"
    cat >"${STUB_DIR}/regctl" <<'STUB'
#!/usr/bin/env bash
case "${STUB_MODE}" in
present)
    echo "sha256:7bd044399f6c06fece596237d4429fb2764eb3070cec5e47b634387b231de557"
    exit 0
    ;;
tag_absent)
    echo "failed to request manifest head ${3}: request failed: not found [http 404]: " >&2
    exit 1
    ;;
name_unknown)
    echo "failed to request manifest head ${3}: request failed: NAME_UNKNOWN" >&2
    exit 1
    ;;
unreachable)
    echo "failed to request manifest head ${3}: Head \"https://x/v2/y/manifests/z\": dial tcp: lookup x: no such host" >&2
    exit 1
    ;;
unauthorized)
    echo "failed to request manifest head ${3}: request failed: unauthorized [http 401]: " >&2
    exit 1
    ;;
*)
    echo "stub: unknown STUB_MODE '${STUB_MODE}'" >&2
    exit 127
    ;;
esac
STUB
    chmod +x "${STUB_DIR}/regctl"
    PATH="${STUB_DIR}:${PATH}"
    export PATH
}

probe() {
    STUB_MODE="$1" run "${PROBE}" example.invalid/repo:1.0
}

# --- state 1: present -> skip -------------------------------------------------------

@test "an existing tag exits 0 so the caller skips" {
    probe present
    [ "$status" -eq 0 ]
}

# --- state 2: positively absent -> publish -------------------------------------------

@test "an http 404 exits 10 so the caller publishes" {
    probe tag_absent
    [ "$status" -eq 10 ]
}

@test "NAME_UNKNOWN exits 10 so the caller publishes" {
    probe name_unknown
    [ "$status" -eq 10 ]
}

# --- state 3: ambiguous -> fail, publish nothing --------------------------------------
#
# These are the cases that matter. A probe failure is NOT evidence that the artifact is
# unpublished, so each must exit neither 0 (silently skipping a real release) nor 10
# (re-pushing over an existing tag).

@test "an unreachable registry fails rather than publishing" {
    probe unreachable
    [ "$status" -ne 0 ]
    [ "$status" -ne 10 ]
}

@test "a rejected credential fails rather than publishing" {
    probe unauthorized
    [ "$status" -ne 0 ]
    [ "$status" -ne 10 ]
}

@test "an ambiguous probe reports the probe's own error" {
    probe unreachable
    [[ "$output" == *"no such host"* ]]
}

@test "an unparseable probe response fails closed" {
    STUB_MODE="something-regctl-would-never-say" run "${PROBE}" example.invalid/repo:1.0
    [ "$status" -ne 0 ]
    [ "$status" -ne 10 ]
}

# --- argument handling ----------------------------------------------------------------

@test "a missing reference fails instead of probing an empty ref" {
    STUB_MODE=present run "${PROBE}"
    [ "$status" -ne 0 ]
    [ "$status" -ne 10 ]
    [[ "$output" == *"usage:"* ]]
}

@test "an empty reference fails instead of probing an empty ref" {
    STUB_MODE=present run "${PROBE}" ""
    [ "$status" -ne 0 ]
    [ "$status" -ne 10 ]
}
