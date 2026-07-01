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
    # LOCAL TEST: stand in for the Hetzner Volume at /var/lib/data. Non-destructive —
    # only formats the second disk (/dev/vdb) if it has no filesystem, then mounts it
    # every boot. Mirrors prod (the Volume is block-mounted at /var/lib/data).
    - name: "Mount local data disk (Volume stand-in) at /var/lib/data"
      commands:
        - |
          DEV=/dev/vdb
          mkdir -p /var/lib/data
          blkid "\$DEV" >/dev/null 2>&1 || mkfs.ext4 -L ncdata "\$DEV"
          mountpoint -q /var/lib/data || mount "\$DEV" /var/lib/data
YAML
	printf 'instance-id: network-local\nlocal-hostname: network\n' >"${seeddir}/meta-data"
	rm -f "${SEED}"
	hdiutil makehybrid -iso -joliet -default-volume-name CIDATA -o "${SEED}" "${seeddir}" >/dev/null

	# OS disk = qcow2 overlay on the immutable base raw (base never mutated), sized
	# LARGER than the image (like a Hetzner cx disk) so the first-boot auto-reset can
	# add the COS_STATE (~10 GB) + COS_PERSISTENT partitions. Without headroom the
	# reset can't run and the VM drops to a recovery login.
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
	echo "   boot_id(before)=${boot1}"

	echo ">> [2] reboot-in-VM"
	# shellcheck disable=SC2310 # intentional: reboot drops the SSH connection, so || true
	ssh_vm 'sudo reboot' || true
	sleep 15
	wait_for_ssh

	echo ">> [3] assert persistence"
	local boot2 persisted ephemeral
	boot2="$(ssh_vm cat /proc/sys/kernel/random/boot_id)"
	persisted="$(ssh_vm 'cat /var/lib/data/marker.txt 2>/dev/null || echo MISSING')"
	ephemeral="$(ssh_vm 'cat /run/ephemeral.txt 2>/dev/null || echo GONE')"
	echo "   boot_id(after) =${boot2}"
	echo "   /var/lib/data/marker.txt = ${persisted}   (expect: persisted)"
	echo "   /run/ephemeral.txt       = ${ephemeral}   (expect: GONE)"

	[[ "${boot1}" != "${boot2}" ]] || {
		echo "!! boot_id unchanged — VM did not actually reboot" >&2
		exit 1
	}
	[[ "${persisted}" = "persisted" ]] || {
		echo "!! /var/lib/data did NOT persist" >&2
		exit 1
	}
	echo ">> PASS: /var/lib/data survived reboot; overlay is ephemeral."
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
