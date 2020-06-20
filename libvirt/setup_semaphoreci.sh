#!/bin/bash

set -Eeoux pipefail

# Download and unzip latest terraform
# https://www.terraform.io/downloads.html
wget -O terraform.zip https://releases.hashicorp.com/terraform/0.12.26/terraform_0.12.26_linux_amd64.zip
unzip terraform.zip -d scripts

# Download and extract the latest terraform-libvirt extension
# https://github.com/dmacvicar/terraform-provider-libvirt/releases
wget -O terraform-provider-libvirt.tar.gz https://github.com/dmacvicar/terraform-provider-libvirt/releases/download/v0.6.2/terraform-provider-libvirt-0.6.2+git.1585292411.8cbe9ad0.Ubuntu_18.04.amd64.tar.gz

# Copy the plugin to the right dir
PLUGIN_DIR="${HOME}/.terraform.d/plugins"
mkdir -p "${PLUGIN_DIR}"
tar -C "${PLUGIN_DIR}" -xf terraform-provider-libvirt.tar.gz

pushd "${SETUP_LIBVIRT_DIR}"
terraform init
popd

LIBVIRT_BRIDGE="kube_network"
DNS_IP="192.168.3.1"

sudo brctl addbr $LIBVIRT_BRIDGE
# ip addr add 192.168.0.2/24 brd + dev br0
# route add default gw 192.168.0.1 dev br0

sudo ip addr add dev $LIBVIRT_BRIDGE $DNS_IP/24
sudo ip link set dev $LIBVIRT_BRIDGE up

sudo dnsmasq \
  --interface="${LIBVIRT_BRIDGE}" \
  --bind-interfaces \
  --dhcp-range=192.168.3.100,192.168.3.200,255.255.255.0,12h \
  --dhcp-leasefile="${SETUP_TMP_DIR}"/dnsmasq.leases \
  --no-resolv \
  --no-hosts \
  --dhcp-option=3,"${DNS_IP}" \
  --dhcp-option=6,"${DNS_IP}" \
  --log-facility="${SETUP_LOG_DIR}"/dnsmasq.log \
  --pid-file="${SETUP_TMP_DIR}"/dnsmasq.pid \
  --log-dhcp \
  --log-queries \
  --user="$(id -un)" \
  --group="$(id -gn)"
