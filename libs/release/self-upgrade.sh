#!/usr/bin/env bash
# release:self_upgrade — propose the consumer pins for the currently published artifacts as a
# PULL REQUEST, so CI answers "does the newly published plugin actually work in the apps that
# deploy it?" before those pins become the deployed state.
#
# This deliberately does NOT push to main. A pin commit pushed straight to main has by
# construction never been validated against the apps that deploy it: bin/openbao-plugin-pin can
# prove the checksum describes the image, but not that the plugin works once Fleet rolls it out.
# Routing it through a PR puts CI between the publish and the cluster. See
# openspec/changes/release-please-openbao-plugins/design.md (D5).
#
# CONVERGENCE, NOT ACCUMULATION. Publishing runs on every push to main AND nightly, so "just open
# a PR" would open one per run. One fixed branch is reused instead:
#
#   - computed pins identical to what the branch already carries -> do nothing at all
#   - computed pins differ                                      -> force-update the branch, and
#                                                                  the existing PR follows it
#
# so there is at most one outstanding proposal and it always describes the newest publish. A
# proposal that was closed unmerged is re-opened by the next run; the nightly schedule is the
# retry.
#
# Usage:
#   moon run release:self_upgrade          # compute, commit, push, open/update the PR
#   SELF_UPGRADE_DRY_RUN=1 ...             # compute and commit locally; never push or call gh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="${SELF_UPGRADE_ROOT:-$(cd "${SCRIPT_DIR}/../.." && pwd -P)}"
BRANCH="${SELF_UPGRADE_BRANCH:-chore/openbao-plugin-pins}"
BASE="${SELF_UPGRADE_BASE:-main}"
REMOTE="${SELF_UPGRADE_REMOTE:-origin}"
DRY_RUN="${SELF_UPGRADE_DRY_RUN:-0}"

cd "${REPO_ROOT}"

# Start from the tip of the base branch, not from whatever this checkout happens to be at: a
# push-triggered publish run is detached at the commit that triggered it, which may already be
# behind if release-please landed a commit since.
echo "==> Fetching ${REMOTE}/${BASE}" >&2
git fetch --quiet "${REMOTE}" "${BASE}"

START_POINT="${REMOTE}/${BASE}"
echo "==> Building pins on ${BRANCH} from ${START_POINT}" >&2
git checkout --quiet -B "${BRANCH}" "${START_POINT}"

# bin/openbao-plugin-pin computes the checksums from the PUBLISHED images and commits both halves
# of every pin together, or commits nothing.
BEFORE="$(git rev-parse HEAD)"
"${REPO_ROOT}/bin/openbao-plugin-pin"
AFTER="$(git rev-parse HEAD)"

if [[ "${BEFORE}" == "${AFTER}" ]]; then
    echo "==> Pins already describe the published images; nothing to propose." >&2
    exit 0
fi

if [[ "${DRY_RUN}" != "0" ]]; then
    echo "==> SELF_UPGRADE_DRY_RUN set; committed locally, not pushing." >&2
    git --no-pager log -1 --stat >&2
    exit 0
fi

# The outstanding proposal is TWO things — a branch and an open PR — and they can come apart.
# Both are checked, because either one alone is not a proposal:
#
#   - Branch matches AND the PR is open  -> genuinely nothing to do.
#   - Branch matches, no open PR         -> the branch is stranded. Happens when `gh pr create`
#                                           failed after the push (a PAT without
#                                           `Pull requests: write` does exactly this), or when
#                                           someone closed the PR unmerged. Do NOT re-push —
#                                           the content is already right — but DO open the PR.
#   - Branch differs                     -> push, then open or update.
#
# Checking only the tree is the bug this comment exists to prevent: it reads "branch is correct"
# as "a proposal exists", so a stranded branch is skipped forever and the run reports success
# having proposed nothing. That is the same fail-open-to-skipping shape as a registry probe
# treating ambiguity as absence.
#
# Trees, not commits: a re-run produces a fresh commit object for identical content, and
# force-pushing that would churn the PR and re-trigger CI for nothing.
NEW_TREE="$(git rev-parse "HEAD^{tree}")"
REMOTE_TREE=""
if git rev-parse --quiet --verify "${REMOTE}/${BRANCH}" >/dev/null 2>&1; then
    REMOTE_TREE="$(git rev-parse "${REMOTE}/${BRANCH}^{tree}")"
fi
PR_STATE="$(gh pr view "${BRANCH}" --json state --jq '.state' 2>/dev/null || true)"

if [[ "${NEW_TREE}" == "${REMOTE_TREE}" && "${PR_STATE}" == "OPEN" ]]; then
    echo "==> ${REMOTE}/${BRANCH} already proposes exactly these pins; leaving it alone." >&2
    gh pr view "${BRANCH}" --json url --jq '.url' >&2
    exit 0
fi

if [[ "${NEW_TREE}" == "${REMOTE_TREE}" ]]; then
    echo "==> ${REMOTE}/${BRANCH} already carries these pins; not re-pushing." >&2
else
    # Force, because the branch is rebuilt from the base tip each run rather than appended to. It
    # carries exactly one bot commit and no human ever works on it.
    echo "==> Pushing ${BRANCH}" >&2
    git push --quiet --force "${REMOTE}" "HEAD:refs/heads/${BRANCH}"
fi

if [[ "${PR_STATE}" == "OPEN" ]]; then
    echo "==> PR for ${BRANCH} is already open; the push updated it." >&2
    gh pr view "${BRANCH}" --json url --jq '.url' >&2
    exit 0
fi

echo "==> Opening a PR for ${BRANCH}" >&2

# Body via a file rather than a command substitution: `--body "$(cat <<EOF ...)"` masks cat's
# exit status, which shellcheck flags and which would silently open a PR with an empty body.
BODY_FILE="$(mktemp)"
trap 'rm -f "${BODY_FILE}"' EXIT

cat >"${BODY_FILE}" <<'BODY'
Opened by `moon run release:self_upgrade` after a successful publish.

Each OpenBao plugin is pinned in two Fleet bundles — the init-container **image tag** in
`apps/secret/src/openbao/values.yaml`, which delivers the binary, and
`plugins.<name>.{version,sha256}` in `apps/secret/src/openbao-config/values.yaml`, which
registers it. OpenBao hashes the binary it is handed and rejects a registration whose checksum
does not describe it, reporting only a bare `checksum mismatch`, so **both halves move in the one
commit on this branch**.

This is a PR rather than a push to `main` on purpose: it is the only point at which the newly
published plugin gets validated against the apps that actually deploy it. Merging it is what
makes these pins the deployed state.

Expect the checksums to change even when the versions do not — a version's first CI build will
not be bit-identical to the locally-built image a checksum may previously have come from.

This branch is rebuilt and force-updated by each publish run, so it always describes the newest
publish. Closing it without merging is fine; the next run re-opens it.
BODY

gh pr create \
    --base "${BASE}" \
    --head "${BRANCH}" \
    --title "chore(secret): pin openbao plugin images and catalog checksums" \
    --body-file "${BODY_FILE}" >&2
