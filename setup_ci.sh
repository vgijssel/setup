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
sudo apt-get -y install podman

# Let's pretend we're docker
sudo ln -s -f /usr/bin/podman /usr/bin/docker

docker image ls 

docker --log-level debug run -it debian:latest ls -la

# podman image ls || true
# docker image ls || true

# source /etc/os-release \
#     && sudo apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common \
#     && curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - \
#     && sudo add-apt-repository "deb [arch=$(dpkg --print-architecture)] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
#     && sudo apt-get update \
#     && sudo apt-get install -y docker-ce-cli \
#     && sudo groupadd docker || true \
#     && sudo adduser buildbuddy docker || true

