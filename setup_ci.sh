 #!/usr/bin/env bash

set -Eeou pipefail 

# exit 0 if docker already exists?

sudo apt-get update \
    && sudo apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common \
    && curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - \
    && sudo add-apt-repository "deb [arch=$(dpkg --print-architecture)] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
    && sudo apt-get update \
    && sudo apt-get install -y docker-ce-cli \
    && sudo groupadd docker || true \
    && sudo adduser buildbuddy docker || true

echo $PATH

which docker
