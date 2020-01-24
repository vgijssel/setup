#!/bin/bash

set -Eeoux pipefail

# Create a network bridge 'qemu-bridge'
ip link add name qemu-bridge type bridge

# Set the bridge to UP
ip link set qemu-bridge up

# Set the bridge ip address to 192.168.100.1, necessary for dnsmasq
ip addr add dev qemu-bridge 192.168.100.1/24

# Enable NAT on the eth0 interface to make traffic to the bridge find a way back
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

iptables -A FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
iptables -A FORWARD -i qemu-bridge -o eth0 -j ACCEPT

# Boot dnsmasq
dnsmasq --log-dhcp --log-facility=/dev/stdout --dhcp-range=192.168.100.10,192.168.100.50,1h

exec "$@"
