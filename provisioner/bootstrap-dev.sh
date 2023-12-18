#!/usr/bin/env bash
set -euo pipefail

apt-get update
apt-get install -y squashfuse fuse sudo lsb-release
useradd -m ubuntu -s /bin/bash
adduser ubuntu sudo
echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers