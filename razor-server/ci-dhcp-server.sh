#!/bin/bash

set -Eeoux pipefail

BRIDGE_INTERFACE="${VAGRANT_BRIDGE_ADAPTER}"
DNS_IP="192.168.1.1"

set +e
kill $(cat "${SETUP_TMP_DIR}"/dnsmasq.pid)
sudo ifconfig "${BRIDGE_INTERFACE}" destroy
set -e

sudo ifconfig "${BRIDGE_INTERFACE}" create
sudo ifconfig "${BRIDGE_INTERFACE}" "${DNS_IP}" netmask 255.255.255.0 up

sudo dnsmasq \
  --interface="${BRIDGE_INTERFACE}" \
  --bind-interfaces \
  --dhcp-range=192.168.1.100,192.168.1.200,255.255.255.0,12h \
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
