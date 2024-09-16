FROM nixos/nix:2.24.3

RUN nix-env -f https://github.com/nix-community/nixos-generators/archive/master.tar.gz -i

# Enable experimanetal features
RUN echo "extra-experimental-features = nix-command flakes" >> /etc/nix/nix.conf

# Pretend we have kvm enabled
RUN echo "system-features = nixos-test benchmark big-parallel kvm" >> /etc/nix/nix.conf

WORKDIR /opt/bastion

# Ensure we symlink bash to /bin/bash otherwise pants will fail.
# Not sure if we can configure PATH in pants for this exact purpose.
RUN ln -sfn /root/.nix-profile/bin/bash /bin/bash

# Can search for packages with: nix-env -qa
RUN nix-env -i nixos-rebuild python3-3.10.14 ps-procps