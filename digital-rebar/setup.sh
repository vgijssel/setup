#!/bin/bash

set -Eeoux pipefail

SUBNET_NAME=enp0s3

SUBNET_CONFIG=$(cat <<EOF
{
  "Validated": true,
  "Available": true,
  "Errors": [],
  "ReadOnly": false,
  "Meta": {
    "color": "black",
    "icon": "cloud",
    "title": "User added"
  },
  "Endpoint": "",
  "Bundle": "",
  "Name": "$SUBNET_NAME",
  "Description": "",
  "Documentation": "",
  "Enabled": true,
  "Proxy": true,
  "Unmanaged": false,
  "Subnet": "$LOCAL_NETWORK_BRIDGE_IP/24",
  "NextServer": "",
  "ActiveStart": "$LOCAL_NETWORK_DHCP_START",
  "ActiveEnd": "$LOCAL_NETWORK_DHCP_END",
  "ActiveLeaseTime": 600,
  "ReservedLeaseTime": 7200,
  "OnlyReservations": false,
  "Options": [
    {
      "Code": 1,
      "Value": "$LOCAL_NETWORK_NETMASK"
    },
    {
      "Code": 3,
      "Value": "$LOCAL_NETWORK_BRIDGE_IP"
    },
    {
      "Code": 6,
      "Value": "$LOCAL_NETWORK_BRIDGE_IP"
    },
    {
      "Code": 15,
      "Value": "$LOCAL_NETWORK_DOMAIN"
    },
    {
      "Code": 28,
      "Value": "$LOCAL_NETWORK_BROADCAST"
    },
    {
      "Code": 42,
      "Value": ""
    },
    {
      "Code": 67,
      "Value": "tftp://$DIGITAL_REBAR_FQDN/lpxelinux.0"
    }
  ],
  "Strategy": "MAC",
  "Pickers": [
    "hint",
    "nextFree",
    "mostExpired"
  ]
}
EOF
)

drpcli subnets destroy "$SUBNET_NAME" || true
drpcli subnets create "$SUBNET_CONFIG"

PUBLIC_KEY=$(cat "$PUBLIC_KEY_PATH")
PUBLIC_KEY_JSON="{ key: '$PUBLIC_KEY' }"
drpcli profiles set global param access-keys to "$PUBLIC_KEY_JSON"
