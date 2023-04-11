 #!/usr/bin/env bash

set -Eeou pipefail 

apt-get update \
    && apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common \
    && curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add - \
    && add-apt-repository "deb [arch=$(dpkg --print-architecture)] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
    && apt-get update \
    && apt-get install -y docker-ce-cli \
    && groupadd docker \
    && adduser buildbuddy docker \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*