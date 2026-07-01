# Ignition / Flatcar provisioning

This app provisions a single Flatcar Container Linux VM in Hetzner Cloud (nbg1)
running the Omada and UniFi controllers, Caddy, Tailscale, and Netdata. The
machine config is authored as **Butane** (`butane.yaml`) and compiled to
**Ignition** by the `poseidon/ct` OpenTofu provider at `plan`/`apply` time — see
`../main.tf` (`data "ct_config"`). There is no separate `butane` CLI step and no
committed Ignition JSON.

## Why units are inlined in `butane.yaml`

`butane.yaml` is a Terraform `templatefile()` template. Secrets (Tailscale
authkey, Cloudflare token, Netdata claim token) and dynamic values (image tags,
the Volume device path, the admin FQDNs) are substituted via `${...}`
placeholders before compilation. All systemd units and on-disk assets
(Caddyfile, launcher scripts) are authored **inline** here rather than as
separate `files/*.service` so that secrets can be injected without ever writing
a rendered file to disk or into git. Only single-line scalars are templated, so
substitution never disturbs YAML indentation.

To inspect the compiled Ignition locally without applying:

```bash
# from the app root, with secrets/.env sourced
echo 'data.ct_config.ignition.rendered' | tofu console
```

(The value is `(known after apply)` because the Butane content depends on the
Volume ID; to render eagerly, substitute a fixed device path into a throwaway
`templatefile()` call.)

## Task 0 — Upload the Flatcar snapshot (one-time)

Hetzner ships no stock Flatcar image, so we upload the official Flatcar Hetzner
image once as a **snapshot** and record its ID into `var.flatcar_snapshot_id`.

Using [`hcloud-upload-image`](https://github.com/apricote/hcloud-upload-image)
(pin the version you install):

```bash
set -a && source ../secrets/.env && set +a   # HCLOUD_TOKEN

# Pin the Flatcar stable release; the Hetzner image is bz2-compressed.
# Install the uploader pinned:
#   GOBIN=$PWD/.tools go install github.com/apricote/hcloud-upload-image@v1.5.0
FLATCAR_VERSION=4593.2.3
URL="https://stable.release.flatcar-linux.net/amd64-usr/${FLATCAR_VERSION}/flatcar_production_hetzner_image.bin.bz2"

.tools/hcloud-upload-image upload \
  --architecture x86 \
  --image-url "$URL" \
  --compression bz2 \
  --location nbg1 \
  --description "flatcar-stable-${FLATCAR_VERSION}" \
  --labels os=flatcar,channel=stable,version=${FLATCAR_VERSION}

# Record the resulting snapshot ID:
hcloud image list --type snapshot
```

The current snapshot is id **403540555** (Flatcar stable 4593.2.3), set as the
default for `var.flatcar_snapshot_id` in `../variables.tf` (override with
`TF_VAR_flatcar_snapshot_id`). The uploader spins up a short-lived temporary
server (small one-off cost) and deletes it automatically.

## Recreate / config-change procedure

The server intentionally has **no `lifecycle.ignore_changes`** on `user_data`.
Changing `butane.yaml` (or any templated value) changes the Ignition, which
**recreates** the VM on the next `apply`. This is the routine config-change
path:

1. Edit `butane.yaml` and `apply`. The VM is replaced; the data **Volume is
   retained** and re-attached.
2. The Volume filesystem is formatted **non-destructively**
   (`wipe_filesystem: false` + label `ncdata`), so the existing filesystem is
   reused and all controller data under `/var/lib/data` survives.
3. A recreate may assign a new Tailscale `100.x` IP. The authkey is **reusable**
   and the hostname is stable, so the node re-joins as the same device. Re-read
   the IP and update `TF_VAR_tailscale_ip`, then `apply` again to refresh the
   private admin DNS records:

   ```bash
   ssh core@<old-or-public-ip> ip -4 -o addr show tailscale0
   TF_VAR_tailscale_ip=<100.x> moon run network-controllers-prod:apply
   ```

A plain `systemctl reboot` (no recreate) preserves `/etc`, `/var`, and the
Volume — both controllers return with data intact.
