#!/usr/bin/env bash
# Boot the Kairos artifact locally in QEMU and drive the persistence test.
#
#   vm.sh up      [arch]   boot the raw image (arm64 = HVF fast loop; amd64 = TCG gate)
#   vm.sh ssh     [arch]   open a shell on the running VM
#   vm.sh verify  [arch]   marker -> reboot-in-VM -> assert /var/lib/data survived
#   vm.sh down    [arch]   shut the VM down
#
# The VM mirrors prod: a SECOND virtual disk is mounted at /var/lib/data (the stand-in
# for the Hetzner Volume), so the reboot-persistence test is faithful at zero cost.
# All VM state lives under image/build/vm-<arch>/ (gitignored). The base .raw is never
# mutated — the OS disk is a qcow2 overlay backed by it.
set -euo pipefail

ACTION="${1:-}"
ARCH="${2:-arm64}"
case "${ARCH}" in arm64 | amd64) ;; *)
	echo "usage: $(basename "$0") <up|ssh|verify|down> [arm64|amd64]" >&2
	exit 2
	;;
esac

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="${SCRIPT_DIR}/build/${ARCH}"
RUN_DIR="${SCRIPT_DIR}/build/vm-${ARCH}"
SSH_PORT=2222
# IdentitiesOnly=yes: offer ONLY our key, else agent/default keys exhaust the server's
# MaxAuthTries and it disconnects with "Too many authentication failures".
SSH_OPTS=(-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR -o IdentitiesOnly=yes -p "${SSH_PORT}")

OVERLAY="${RUN_DIR}/os.qcow2"
DATA="${RUN_DIR}/data.qcow2"
CODE_FW="${RUN_DIR}/code.fd"
VARS_FW="${RUN_DIR}/efivars.fd"
SEED="${RUN_DIR}/seed.iso"
KEY="${RUN_DIR}/id_ed25519"
PIDFILE="${RUN_DIR}/qemu.pid"
CONSOLE="${RUN_DIR}/console.log"

# amd64 uses TCG emulation; arm64 uses HVF on Apple Silicon.
if [[ "${ARCH}" = "arm64" ]]; then
	QEMU=qemu-system-aarch64
	ACCEL="hvf"
	HOST_FW="/opt/homebrew/share/qemu/edk2-aarch64-code.fd"
else
	QEMU=qemu-system-x86_64
	ACCEL="tcg"
	HOST_FW="/opt/homebrew/share/qemu/edk2-x86_64-code.fd"
fi

ssh_vm() { ssh "${SSH_OPTS[@]}" -i "${KEY}" "kairos@127.0.0.1" "$@"; }

wait_for_ssh() {
	echo ">> waiting for SSH on :${SSH_PORT} (first boot runs install->reboot, be patient) ..."
	for _ in $(seq 1 150); do
		# shellcheck disable=SC2310 # intentional: probe connectivity without exiting on failure
		if ssh_vm -o ConnectTimeout=3 true 2>/dev/null; then
			echo ">> SSH up."
			return 0
		fi
		sleep 5
	done
	echo "!! SSH did not come up; see ${CONSOLE}" >&2
	return 1
}

cmd_up() {
	local raws=("${BUILD_DIR}"/*.raw)
	local raw="${raws[0]}"
	[[ -e "${raw}" ]] || {
		echo "!! no raw image in ${BUILD_DIR}; run build-image first" >&2
		exit 1
	}
	mkdir -p "${RUN_DIR}"

	# Ephemeral test SSH keypair (local only, gitignored).
	[[ -f "${KEY}" ]] || ssh-keygen -t ed25519 -N "" -f "${KEY}" -C "network-vm-test" >/dev/null

	# Local walking-skeleton cloud-config (self-contained). Kairos' datasource reads
	# the `cdrom` provider (a real /dev/sr0 with user-data + meta-data), then runs the
	# initramfs + boot stages from it, so users and the mount live under one `stages:`
	# tree (the map form the baked 90_custom.yaml uses). The committed
	# cloud-config/config.yaml stays the PROD template (delivered via user_data in
	# Phase 4); this local seed exercises the same mechanism at zero cost.
	local seeddir="${RUN_DIR}/seed" pub
	pub="$(cat "${KEY}.pub")"
	rm -rf "${seeddir}"
	mkdir -p "${seeddir}"
	cat >"${seeddir}/user-data" <<YAML
#cloud-config
stages:
  initramfs:
    - name: "Local admin user + SSH key"
      users:
        kairos:
          groups: [admin]
          ssh_authorized_keys:
            - ${pub}
  boot:
    # The Kairos image ships fail2ban with a PERSISTENT ban DB. All host->guest SSH
    # arrives from the slirp gateway 10.0.2.2, so any probe storm bans it for good.
    # Ignore the local net AND clear existing bans on every boot (local-test only;
    # prod wants fail2ban fully active on the public ports).
    - name: "Allow host (slirp gateway) past fail2ban"
      commands:
        - |
          systemctl is-active fail2ban >/dev/null 2>&1 || exit 0
          fail2ban-client set sshd addignoreip 10.0.2.0/24 || true
          fail2ban-client unban --all || true
    # LOCAL TEST: stand in for the Hetzner Volume via the second disk /dev/vdb. Runs the
    # SAME baked script prod runs (with the prod device), so the reboot-persistence test
    # exercises the real bind-mount set at zero cost. Non-destructive (only formats a
    # fresh disk). No Tailscale authkey is seeded, so tailscaled comes up but the
    # tailscale-up oneshot is skipped — no external join (local, no-secret run).
    - name: "Mount data volume (stand-in) + service bind mounts"
      commands:
        - /usr/bin/network-mount-data.sh /dev/vdb
YAML
	printf 'instance-id: network-local\nlocal-hostname: network\n' >"${seeddir}/meta-data"
	rm -f "${SEED}"
	hdiutil makehybrid -iso -joliet -default-volume-name CIDATA -o "${SEED}" "${seeddir}" >/dev/null

	# OS disk = qcow2 overlay on the immutable base raw (base never mutated), sized
	# LARGER than the image (like a Hetzner cx disk) so the first-boot auto-reset can
	# add the COS_STATE (~10 GB) + COS_PERSISTENT partitions. Without headroom the
	# reset can't run and the VM drops to a recovery login.
	# A rebuild overwrites the base .raw in place, which would corrupt an overlay still
	# backed by the old image — so drop a stale overlay (older than the raw) and re-base.
	if [[ -f "${OVERLAY}" && "${raw}" -nt "${OVERLAY}" ]]; then
		echo ">> base image rebuilt since last boot — recreating OS overlay from fresh raw"
		rm -f "${OVERLAY}"
	fi
	[[ -f "${OVERLAY}" ]] || qemu-img create -f qcow2 -F raw -b "${raw}" "${OVERLAY}" 40G >/dev/null
	# Second disk = the /var/lib/data Volume stand-in (persists on host across runs).
	[[ -f "${DATA}" ]] || qemu-img create -f qcow2 "${DATA}" 8G >/dev/null

	# UEFI pflash images must be 64 MiB for the arm64 `virt` machine — pad copies.
	# Always regenerate the writable vars store: a change in the QEMU device set can
	# otherwise leave a stale BootOrder that drops the VM into the UEFI shell. With a
	# clean store the firmware boots via the ESP fallback (\EFI\BOOT\BOOTAA64.EFI).
	dd if=/dev/zero of="${VARS_FW}" bs=1m count=64 2>/dev/null
	if [[ ! -f "${CODE_FW}" ]]; then
		dd if=/dev/zero of="${CODE_FW}" bs=1m count=64 2>/dev/null
		dd if="${HOST_FW}" of="${CODE_FW}" conv=notrunc 2>/dev/null
	fi

	local runpid=""
	[[ -f "${PIDFILE}" ]] && runpid="$(cat "${PIDFILE}")"
	if [[ -n "${runpid}" ]] && kill -0 "${runpid}" 2>/dev/null; then
		echo ">> VM already running (pid ${runpid})."
		return 0
	fi

	echo ">> booting ${ARCH} VM (accel=${ACCEL}) from $(basename "${raw}")"
	: >"${CONSOLE}"
	"${QEMU}" \
		-machine "virt,accel=${ACCEL}" -cpu host -smp 2 -m 4096 \
		-drive "if=pflash,format=raw,readonly=on,file=${CODE_FW}" \
		-drive "if=pflash,format=raw,file=${VARS_FW}" \
		-drive "if=virtio,format=qcow2,file=${OVERLAY}" \
		-drive "if=virtio,format=qcow2,file=${DATA}" \
		-device virtio-scsi-pci,id=scsi0 \
		-drive "if=none,id=cd0,format=raw,readonly=on,file=${SEED}" \
		-device scsi-cd,drive=cd0 \
		-netdev "user,id=n0,hostfwd=tcp::${SSH_PORT}-:22" -device virtio-net-pci,netdev=n0 \
		-display none \
		-chardev "socket,id=s0,host=127.0.0.1,port=4444,server=on,wait=off,logfile=${CONSOLE}" \
		-serial chardev:s0 \
		-daemonize -pidfile "${PIDFILE}"

	wait_for_ssh
}

cmd_down() {
	local runpid=""
	[[ -f "${PIDFILE}" ]] && runpid="$(cat "${PIDFILE}")"
	if [[ -n "${runpid}" ]] && kill -0 "${runpid}" 2>/dev/null; then
		kill "${runpid}" && echo ">> VM stopped."
	else
		echo ">> VM not running."
	fi
	rm -f "${PIDFILE}"
}

cmd_verify() {
	echo ">> [1] write markers + record boot id"
	local boot1
	boot1="$(ssh_vm cat /proc/sys/kernel/random/boot_id)"
	# marker on the Volume stand-in (must survive) + a control on /run (tmpfs, must be
	# gone). NB: this Kairos/Ubuntu build persists /opt by default, so /opt is NOT a
	# valid ephemeral control — Phase 2 maps the full persistence set.
	ssh_vm 'sudo sh -c "echo persisted > /var/lib/data/marker.txt; echo ephemeral > /run/ephemeral.txt; sync"'
	# Per-service state markers (each service keeps its state on the volume).
	ssh_vm 'sudo sh -c "echo ts-persisted > /var/lib/data/tailscale/marker.txt; sync"'    # T2 Tailscale
	ssh_vm 'sudo sh -c "echo nd-persisted > /var/lib/data/netdata/marker.txt; sync"'      # T3 Netdata
	ssh_vm 'sudo sh -c "echo cd-persisted > /var/lib/data/caddy/marker.txt; sync"'        # T4 Caddy
	echo "   boot_id(before)=${boot1}"

	echo ">> [2] assert services active (pre-reboot)"
	assert_services

	echo ">> [3] reboot-in-VM"
	# shellcheck disable=SC2310 # intentional: reboot drops the SSH connection, so || true
	ssh_vm 'sudo reboot' || true
	sleep 15
	wait_for_ssh

	echo ">> [4] assert persistence + services (post-reboot)"
	local boot2 persisted ephemeral ts_marker nd_marker cd_marker
	boot2="$(ssh_vm cat /proc/sys/kernel/random/boot_id)"
	# Read with sudo: some service state dirs are 0700 root (e.g. tailscaled's statedir).
	persisted="$(ssh_vm 'sudo cat /var/lib/data/marker.txt 2>/dev/null || echo MISSING')"
	ephemeral="$(ssh_vm 'sudo cat /run/ephemeral.txt 2>/dev/null || echo GONE')"
	ts_marker="$(ssh_vm 'sudo cat /var/lib/data/tailscale/marker.txt 2>/dev/null || echo MISSING')"
	nd_marker="$(ssh_vm 'sudo cat /var/lib/data/netdata/marker.txt 2>/dev/null || echo MISSING')"
	cd_marker="$(ssh_vm 'sudo cat /var/lib/data/caddy/marker.txt 2>/dev/null || echo MISSING')"
	echo "   boot_id(after) =${boot2}"
	echo "   /var/lib/data/marker.txt           = ${persisted}   (expect: persisted)"
	echo "   /run/ephemeral.txt                 = ${ephemeral}   (expect: GONE)"
	echo "   /var/lib/data/tailscale/marker.txt = ${ts_marker}   (expect: ts-persisted)"
	echo "   /var/lib/data/netdata/marker.txt   = ${nd_marker}   (expect: nd-persisted)"
	echo "   /var/lib/data/caddy/marker.txt     = ${cd_marker}   (expect: cd-persisted)"

	[[ "${boot1}" != "${boot2}" ]] || {
		echo "!! boot_id unchanged — VM did not actually reboot" >&2
		exit 1
	}
	[[ "${persisted}" = "persisted" ]] || {
		echo "!! /var/lib/data did NOT persist" >&2
		exit 1
	}
	[[ "${ts_marker}" = "ts-persisted" ]] || {
		echo "!! tailscale state did NOT persist across reboot" >&2
		exit 1
	}
	[[ "${nd_marker}" = "nd-persisted" ]] || {
		echo "!! netdata state did NOT persist across reboot" >&2
		exit 1
	}
	[[ "${cd_marker}" = "cd-persisted" ]] || {
		echo "!! caddy data dir did NOT persist across reboot" >&2
		exit 1
	}
	assert_services
	echo ">> PASS: services active; service state survived reboot; overlay is ephemeral."
}

# Assert every baked service is active and its state dir is bound onto the data volume.
# Grows one block per service as Phase 1/2 tasks land.
assert_services() {
	# T2 Tailscale: daemon active + its state dir lives on the data volume (via --statedir,
	# not the OS-disk COS_PERSISTENT bind Kairos applies to /var/lib/tailscale). No tailnet
	# join is checked — the local run seeds no authkey; the real join is verified live.
	# shellcheck disable=SC2310 # intentional: ssh_vm in || is a boolean probe here
	ssh_vm 'systemctl is-active --quiet tailscaled' || {
		echo "!! tailscaled is not active" >&2
		exit 1
	}
	# shellcheck disable=SC2310 # intentional: boolean probe
	ssh_vm 'systemctl show -p ExecStart tailscaled | grep -q -- "--statedir=/var/lib/data/tailscale"' || {
		echo "!! tailscaled is not configured with --statedir on the data volume" >&2
		exit 1
	}
	# The statedir must physically sit on the volume device, not the /var overlay.
	# shellcheck disable=SC2310,SC2016 # intentional: boolean probe; $(...) must run on the VM
	ssh_vm 'test -d /var/lib/data/tailscale && [ "$(stat -c %d /var/lib/data/tailscale)" = "$(stat -c %d /var/lib/data)" ]' || {
		echo "!! /var/lib/data/tailscale is not on the data volume" >&2
		exit 1
	}
	echo "   [ok] tailscaled active; state dir on /var/lib/data (volume)"

	# T3 Netdata: daemon active + lib dir on the volume (netdata.conf directories). Not
	# claimed locally (no secret); the Cloud claim is verified in the live phase.
	# shellcheck disable=SC2310 # intentional: boolean probe
	ssh_vm 'systemctl is-active --quiet netdata' || {
		echo "!! netdata is not active" >&2
		exit 1
	}
	# shellcheck disable=SC2310,SC2016 # intentional: boolean probe; $(...) must run on the VM
	ssh_vm 'test -d /var/lib/data/netdata && [ "$(stat -c %d /var/lib/data/netdata)" = "$(stat -c %d /var/lib/data)" ]' || {
		echo "!! /var/lib/data/netdata is not on the data volume" >&2
		exit 1
	}
	echo "   [ok] netdata active; lib dir on /var/lib/data (volume)"

	# T4 Caddy: the binary must carry the Cloudflare DNS module, the baked Caddyfile must
	# validate (proves the `dns cloudflare` directive resolves = module present), and its
	# data dir must be on the volume. NOT asserted active: with no tailnet join there's no
	# tailscale0 to bind, so caddy stays down locally — the live bind + LE issuance is T13.
	# shellcheck disable=SC2310 # intentional: boolean probe
	ssh_vm 'caddy list-modules 2>/dev/null | grep -q "^dns.providers.cloudflare"' || {
		echo "!! caddy binary is missing the cloudflare DNS module" >&2
		exit 1
	}
	# Validate the baked Caddyfile with dummy env (placeholders resolve at adapt time). The
	# cloudflare provider format-checks the token at provision (no network call), so use a
	# format-valid 40-char dummy — this fully exercises the DNS-01 issuer wiring offline.
	# shellcheck disable=SC2310 # intentional: boolean probe
	ssh_vm 'CADDY_EMAIL=a@b.c CADDY_OMADA_FQDN=omada.test CADDY_UNIFI_FQDN=unifi.test CLOUDFLARE_API_TOKEN=0123456789abcdef0123456789abcdef01234567 TS_IP=127.0.0.1 caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1' || {
		echo "!! baked Caddyfile failed to validate" >&2
		exit 1
	}
	# shellcheck disable=SC2310,SC2016 # intentional: boolean probe; $(...) must run on the VM
	ssh_vm 'test -d /var/lib/data/caddy && [ "$(stat -c %d /var/lib/data/caddy)" = "$(stat -c %d /var/lib/data)" ]' || {
		echo "!! /var/lib/data/caddy is not on the data volume" >&2
		exit 1
	}
	echo "   [ok] caddy has cloudflare module; Caddyfile validates; data dir on volume"
}

case "${ACTION}" in
up) cmd_up ;;
ssh) ssh_vm ;;
verify) cmd_verify ;;
down) cmd_down ;;
*)
	echo "usage: $(basename "$0") <up|ssh|verify|down> [arm64|amd64]" >&2
	exit 2
	;;
esac
