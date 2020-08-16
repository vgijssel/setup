#!/bin/bash

set -Eeoux pipefail

FLANNEL_MANIFEST="https://raw.githubusercontent.com/coreos/flannel/2140ac876ef134e0ed5af15c65e414cf26827915/Documentation/kube-flannel.yml"
STATUS_CHECK="{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}"

ssh "${CONTROL_PLANE_ENDPOINT}" << SSH
  set -Eeoux pipefail

  KUBE_CONFIG_DIR="\${HOME}/.kube"
  USER_NAME="\$(id -un)"
  GROUP_NAME="\$(id -gn)"

  sudo kubeadm reset --force

  sudo kubeadm init \
    --control-plane-endpoint "${CONTROL_PLANE_ENDPOINT}" \
    --ignore-preflight-errors NumCPU

  sudo mkdir -p "\${KUBE_CONFIG_DIR}"
  sudo cp -v /etc/kubernetes/admin.conf "\${KUBE_CONFIG_DIR}/config"
  sudo chown -vR \$USER_NAME:\$GROUP_NAME "\${KUBE_CONFIG_DIR}"

  kubectl apply -f "$FLANNEL_MANIFEST"

  timeout 5m bash <<STATUS
    set -Eeoux pipefail

    until kubectl get node "$(hostname)" -o jsonpath="$STATUS_CHECK" | grep 'Ready=True'
    do
      echo "Not ready, sleeping for 5 seconds."
      sleep 5
    done
  STATUS
SSH
