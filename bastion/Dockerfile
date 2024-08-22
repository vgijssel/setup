FROM nixos/nix:2.24.3

RUN nix-env -f https://github.com/nix-community/nixos-generators/archive/master.tar.gz -i

# Enable experimanetal features
RUN echo "extra-experimental-features = nix-command flakes" >> /etc/nix/nix.conf

# Pretend we have kvm enabled
RUN echo "system-features = nixos-test benchmark big-parallel kvm" >> /etc/nix/nix.conf

WORKDIR /opt/bastion

COPY bastion/flake.nix .
COPY bastion/flake.lock .

# Build the actual 
# nix build .#nixosConfigurations.bastion.config.formats.qcow