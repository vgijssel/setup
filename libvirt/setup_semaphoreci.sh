#!/bin/bash

set -Eeoux pipefail

# Setup Terraform
PLUGIN_DIR="${HOME}/.terraform.d/plugins"
mkdir -p "${PLUGIN_DIR}"

# Download and unzip latest terraform
# https://www.terraform.io/downloads.html
wget -O terraform.zip https://releases.hashicorp.com/terraform/0.12.26/terraform_0.12.26_linux_amd64.zip
unzip -o terraform.zip -d scripts

# Download and extract the latest terraform-libvirt extension
# https://github.com/dmacvicar/terraform-provider-libvirt/releases
wget -O terraform-provider-libvirt.tar.gz https://github.com/dmacvicar/terraform-provider-libvirt/releases/download/v0.6.2/terraform-provider-libvirt-0.6.2+git.1585292411.8cbe9ad0.Ubuntu_18.04.amd64.tar.gz
tar -C "${PLUGIN_DIR}" -xf terraform-provider-libvirt.tar.gz

# Download and extract the latest terraform-provider-ansible
# https://github.com/nbering/terraform-provider-ansible/releases
wget -O terraform-provider-ansible.zip https://github.com/nbering/terraform-provider-ansible/releases/download/v1.0.3/terraform-provider-ansible-linux_amd64.zip
unzip -o terraform-provider-ansible.zip -d "${PLUGIN_DIR}"

pushd "${SETUP_LIBVIRT_DIR}"
terraform init
popd

LIBVIRT_BRIDGE="kube_network"
DNS_IP="192.168.3.1"

# Setup a bridge device to which the libvirt machines attach
sudo ip link set dev $LIBVIRT_BRIDGE down || true
sudo brctl delbr $LIBVIRT_BRIDGE || true
sudo brctl addbr $LIBVIRT_BRIDGE
# ip addr add 192.168.0.2/24 brd + dev br0
# route add default gw 192.168.0.1 dev br0
sudo ip addr add dev $LIBVIRT_BRIDGE $DNS_IP/24
sudo ip link set dev $LIBVIRT_BRIDGE up

# Start dnsmasq listening on the bridge setting upstream server
# to server previously in /etc/resolv.conf
sudo kill -9 $(cat "${SETUP_TMP_DIR}/dnsmasq.pid" || true) || true
sudo dnsmasq \
  --interface="${LIBVIRT_BRIDGE}" \
  --bind-interfaces \
  --dhcp-range=192.168.3.100,192.168.3.200,255.255.255.0,12h \
  --dhcp-leasefile="${SETUP_TMP_DIR}"/dnsmasq.leases \
  --dhcp-option=3,"${DNS_IP}" \
  --dhcp-option=6,"${DNS_IP}" \
  --log-facility="${SETUP_LOG_DIR}"/dnsmasq.log \
  --pid-file="${SETUP_TMP_DIR}"/dnsmasq.pid \
  --log-dhcp \
  --log-queries \
  --user="$(id -un)" \
  --group="$(id -gn)"

# Forward all dnsrequests to the local running dnsmasq server
# so we can resolve hostnames of the vms attached to this bridge
# Note we're prepending the 127.0.0.1 nameserver to the existing nameservers
# Because we need a reference to the existing nameservers
echo "nameserver 127.0.0.1" | cat - /etc/resolv.conf | sudo tee /etc/resolv.conf

# Solution from https://unix.stackexchange.com/a/536571
# Update apparmor for libvirt to allow for reading/writing/locking volume to /data/vms/storage
# Get apparmor related messages
# sudo journalctl --boot _TRANSPORT=audit
cat <<EOF | sudo tee /etc/apparmor.d/libvirt/TEMPLATE.qemu
#
# This profile is for the domain whose UUID matches this file.
#

#include <tunables/global>

profile LIBVIRT_TEMPLATE flags=(attach_disconnected) {
    #include <abstractions/libvirt-qemu>
    /data/vms/storage/ wrk,
    /data/vms/storage/** wrk,
}
EOF

# Make sure we have access to the mkisofs binary
sudo ln -sf /usr/bin/genisoimage /usr/bin/mkisofs

# Enable packet forwarding
cat <<EOF | sudo tee /etc/sysctl.conf
# Uncomment the next line to enable packet forwarding for IPv4
net.ipv4.ip_forward=1
EOF
sudo sysctl -p

# Enable routing of packages between bridge and external nat
sudo apt-get install -y iptables unzip git jq
sudo iptables -t nat -A POSTROUTING -s 192.168.3.0/24 -j MASQUERADE
