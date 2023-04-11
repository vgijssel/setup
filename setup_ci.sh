 #!/usr/bin/env bash

set -Eeoux pipefail 

# exit 0 if docker already exists?
cat /etc/os-release
env
mount

sudo apt-get update
sudo apt-get -y install gnupg

# Podman installation from https://www.cyberithub.com/how-to-install-podman-on-ubuntu-20-04-lts-step-by-step/
source /etc/os-release

echo "deb https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/xUbuntu_${VERSION_ID}/ /" | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
curl -L https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/xUbuntu_${VERSION_ID}/Release.key | sudo apt-key add -

sudo apt-get update
sudo apt-get -y install podman fuse-overlayfs

# Fixing podman storage https://github.com/containers/buildah/issues/3666#issuecomment-1349687679
cat /etc/containers/storage.conf
sed -i 's/#mount_program/mount_program/' /etc/containers/storage.conf

# Fix podman networking https://github.com/microsoft/WSL/issues/7948#issuecomment-1043467915
update-alternatives --set iptables /usr/sbin/iptables-legacy
update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy

# Force create network called podman
# sudo podman network create podman

# Let's pretend we're docker
# sudo ln -s -f /usr/bin/podman /usr/bin/docker
rm -f /usr/bin/docker

podman image ls 
podman info
podman version

# docker --log-level debug run -it debian:latest ls -la

# podman image ls || true
# docker image ls || true

source /etc/os-release \
    && curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - \
    && sudo add-apt-repository "deb [arch=$(dpkg --print-architecture)] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
    && sudo apt-get update \
    && sudo apt-get install -y docker-ce-cli

docker version

