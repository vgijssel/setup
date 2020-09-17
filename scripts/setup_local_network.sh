#!/bin/bash

set -Eeoux pipefail

DNSMASQ_LEASE_FILE="$SETUP_TMP_DIR/dnsmasq.leases"
DNSMASQ_LOG_FILE="$SETUP_LOG_DIR/dnsmasq.log"
DNSMASQ_PID_FILE="$SETUP_TMP_DIR/dnsmasq.pid"
NAT_RULES_FILE="$SETUP_TMP_DIR/nat_rules"

DNS_HEAVEN_PID=$(pgrep dns-heaven || true)

if [ -z "$DNS_HEAVEN_PID" ]; then
  echo "Please make sure dns-heaven is running to make golang DNS resolution work on macos."
  echo "https://github.com/greenboxal/dns-heaven"
  exit 1
fi

# NOTE: create bridge using macos network preferences, otherwise the bridge is constantly magically removed?
# destroy if exists and create bridge interface
# sudo ifconfig "$LOCAL_NETWORK_BRIDGE_INTERFACE" destroy || true
# sudo ifconfig "$LOCAL_NETWORK_BRIDGE_INTERFACE" create
sudo ifconfig "$LOCAL_NETWORK_BRIDGE_INTERFACE" "$LOCAL_NETWORK_BRIDGE_IP" netmask "$LOCAL_NETWORK_NETMASK" up

# Enable packet forwarding
sudo sysctl -w net.inet.ip.forwarding=1

# Enable NAT forwarding from internet interface to bridge interface
cat <<EOF | tee "$NAT_RULES_FILE"
nat on $LOCAL_NETWORK_INTERNET_INTERFACE from $LOCAL_NETWORK_BRIDGE_INTERFACE:network to any -> ($LOCAL_NETWORK_INTERNET_INTERFACE)
EOF

# Flush the existing pfctl firewall rules and load the new rules
sudo pfctl -F all
sudo pfctl -f "$NAT_RULES_FILE" -e || true

# kill if exists and boot dnsmasq server on bridge interface
# matching all dns requests to *.local_network_domain to bridge ip so Vagrant doesn't crash
# and kubernetes ingress dns resolution works
kill $(cat "$DNSMASQ_PID_FILE") || true
sudo dnsmasq \
     --bind-interfaces \
     --listen-address="$LOCAL_NETWORK_BRIDGE_IP" \
     --address="/$LOCAL_NETWORK_DOMAIN/$KUBERNETES_INGRESS_IP" \
     --dhcp-range="$LOCAL_NETWORK_DHCP_START,$LOCAL_NETWORK_DHCP_END,$LOCAL_NETWORK_NETMASK,12h" \
     --dhcp-leasefile="$DNSMASQ_LEASE_FILE" \
     --log-facility="$DNSMASQ_LOG_FILE" \
     --pid-file="$DNSMASQ_PID_FILE" \
     --log-dhcp \
     --log-queries \
     --domain "$LOCAL_NETWORK_DOMAIN" \
     --user="$(id -un)" \
     --group="$(id -gn)"

# create /etc/resolver entry pointing to bridge interface
cat <<EOF | sudo tee "/etc/resolver/$LOCAL_NETWORK_DOMAIN"
nameserver $LOCAL_NETWORK_BRIDGE_IP
EOF

IFS=. read ip1 ip2 ip3 ip4 <<< "$LOCAL_NETWORK_BRIDGE_IP"
# Create SSH config
cat <<EOF | sudo tee "$LOCAL_NETWORK_SSH_CONFIG_PATH"
Include ~/.ssh/config
Host *.$LOCAL_NETWORK_DOMAIN
  UserKnownHostsFile /dev/null
  StrictHostKeyChecking no
  User vagrant
  IdentityFile $PRIVATE_KEY_PATH

Host $ip1.$ip2.$ip3.*
  UserKnownHostsFile /dev/null
  StrictHostKeyChecking no
  User vagrant
  IdentityFile $PRIVATE_KEY_PATH
EOF

# reset dns cache
dscacheutil -flushcache
sudo killall -HUP mDNSResponder
