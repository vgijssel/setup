FROM nixos/nix:2.24.3

RUN nix-env -f https://github.com/nix-community/nixos-generators/archive/master.tar.gz -i

# Install nixos-rebuild to apply changes to a remote machine
# RUN nix-env -i nixos-rebuild
# RUN nix-env -i colmena

# Enable experimanetal features
RUN echo "extra-experimental-features = nix-command flakes" >> /etc/nix/nix.conf

# Pretend we have kvm enabled
RUN echo "system-features = nixos-test benchmark big-parallel kvm" >> /etc/nix/nix.conf

WORKDIR /opt/bastion
# COPY bastion/flake.nix .
# COPY bastion/flake.lock .

# Ensure we symlink bash to /bin/bash otherwise pants will fail.
# Not sure if we can configure PATH in pants for this exact purpose.
RUN ln -sfn /root/.nix-profile/bin/bash /bin/bash

# build and not run the following flake for faster execution?
# nix run github:serokell/deploy-rs

# Build the actual 

# nix build .#nixosConfigurations.bastion.config.formats.qcow

# Copy the image to the host
# cp result/nixos.qcow2 .