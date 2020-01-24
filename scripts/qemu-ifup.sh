#!/bin/bash

# macos:
# sudo ifconfig bridge1 addm $1

QEMU_BRIDGE='qemu-bridge'
ip link set dev $1 up
ip link set dev $1 master $QEMU_BRIDGE
