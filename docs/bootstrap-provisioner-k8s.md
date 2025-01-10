---
title: Bootstrap provisioner-k8s
publish: hidden
---

1. Create Incus instance

   ```bash
   # Create Incus VM (not container)
   incus create images:ubuntu/24.04 provisioner-k8s --vm

   # Set max memory to 7GiB
   incus config set provisioner-k8s limits.memory 7GiB

   # Set cpu cores to 4
   incus config set provisioner-k8s limits.cpu 4

   # Set storage to 50GiB
   incus config device override provisioner-k8s root size=50GiB

   # Start!
   incus start provisioner-k8s
   ```

1. Run Ansible playbook with local inventory

   ```bash
   task provisioner-k8s:provision:local
   ```

1. Validate if host can now be provisioned through Tailscale

   ```bash
   task provisioner-k8s:provision
   ```

1. Copy Kubernetes secret `/etc/rancher/k3s/k3s.yaml` into 1Password `op://vgijssel-prod/provisioner-k8s-kubeconfig/certificate`
1. Modify server url to [`https://provisioner-k8s.tail2c33e2.ts.net:6443`](https://provisioner-k8s.tail2c33e2.ts.net:6443/)
1. Update devenv secrets
   ```bash
   task devenv:secrets
   ```
