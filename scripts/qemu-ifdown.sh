#!/bin/bash

# macos:
# sudo ifconfig bridge1 deletem $1

QEMU_BRIDGE='qemu-bridge'
ip link set dev $1 nomaster
ip link set dev $1 down
