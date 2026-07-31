#!/usr/bin/env bash
# secret:backup — force an on-demand OpenBao Raft snapshot NOW, instead of waiting for the
# hourly snapshotAgent schedule. Triggers the same CronJob (openbao-snapshot) by creating a
# one-off Job from it, waits for completion, and reports the S3 upload.
#
# Same mechanism as the scheduled backup (nothing bespoke): the Job runs the pinned
# snapshot-agent image, logs in as the least-privilege `snapshot` role, takes a Raft snapshot
# via OpenBao's API, and uploads it to s3://enigma-s3-backup/openbao/ with s3cmd. Use it to
# capture a point-in-time backup before a risky change, or to smoke-test the pipeline.
#
# Idempotent: deletes any prior same-named manual Job first, then re-creates it. The completed
# Job is left in place so its logs stay inspectable until the next run.
set -euo pipefail

NS="${SECRET_NAMESPACE:-secret}"
CLUSTER_NAME="${SECRET_CLUSTER_NAME:-secret}"
CRONJOB="${OPENBAO_SNAPSHOT_CRONJOB:-openbao-snapshot}"
JOB="${BACKUP_JOB_NAME:-openbao-backup-manual}"
TIMEOUT="${BACKUP_TIMEOUT:-600}"

require() { command -v "$1" >/dev/null 2>&1 || {
  echo "ERROR: '$1' is required but not found" >&2
  exit 1
}; }
require vcluster
require kubectl

# Point kubectl at the '${CLUSTER_NAME}' vind cluster regardless of the ambient kube-context
# (select the docker driver + connect; idempotent).
echo "==> Connecting to the '${CLUSTER_NAME}' vind cluster (vcluster connect)"
vcluster use driver docker >/dev/null 2>&1 || true
vcluster connect "${CLUSTER_NAME}"

# Fail early if the CronJob isn't there (wrong cluster/context, or not applied yet).
if ! kubectl -n "${NS}" get cronjob "${CRONJOB}" >/dev/null 2>&1; then
  ctx="$(kubectl config current-context 2>/dev/null || echo '?')"
  echo "ERROR: CronJob ${NS}/${CRONJOB} not found — wrong kube context, or the openbao bundle" >&2
  echo "       isn't applied yet (run 'moon run ${CLUSTER_NAME}:apply'). Current context: ${ctx}" >&2
  exit 1
fi

# Trigger a fresh run (remove any leftover from a previous manual backup first).
kubectl -n "${NS}" delete job "${JOB}" --ignore-not-found >/dev/null
echo "==> Triggering an on-demand snapshot (Job ${JOB} from cronjob/${CRONJOB})"
kubectl -n "${NS}" create job "${JOB}" --from="cronjob/${CRONJOB}" >/dev/null

# Wait for a terminal state (Complete or Failed). Poll conditions rather than `kubectl wait`,
# which can only watch one condition at a time (a failing Job would hang until timeout).
echo "==> Waiting for the backup to finish (timeout ${TIMEOUT}s)"
deadline=$((SECONDS + TIMEOUT))
state=""
while [[ ${SECONDS} -lt ${deadline} ]]; do
  complete="$(kubectl -n "${NS}" get job "${JOB}" -o jsonpath='{.status.conditions[?(@.type=="Complete")].status}' 2>/dev/null)" || true
  if [[ "${complete}" == "True" ]]; then
    state="complete"
    break
  fi
  failed="$(kubectl -n "${NS}" get job "${JOB}" -o jsonpath='{.status.conditions[?(@.type=="Failed")].status}' 2>/dev/null)" || true
  if [[ "${failed}" == "True" ]]; then
    state="failed"
    break
  fi
  sleep 5
done

echo "==> Backup Job logs:"
kubectl -n "${NS}" logs "job/${JOB}" 2>&1 | sed 's/^/    /' || true

case "${state}" in
complete)
  upload="$(kubectl -n "${NS}" logs "job/${JOB}" 2>/dev/null | grep -m1 'upload:' || true)"
  echo "==> ✅ Backup complete."
  [[ -n "${upload}" ]] && echo "    ${upload}"
  ;;
failed)
  echo "==> ❌ Backup Job failed — see the logs above." >&2
  exit 1
  ;;
*)
  echo "==> ❌ Backup did not finish within ${TIMEOUT}s (Job ${NS}/${JOB} still running)." >&2
  echo "    Inspect: kubectl -n ${NS} get job ${JOB}; kubectl -n ${NS} logs job/${JOB} -f" >&2
  exit 1
  ;;
esac
