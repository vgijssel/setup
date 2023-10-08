#!/bin/sh

set -x
# set -e



if [ -f /nix/receipt.json ]; then
  echo "Nix already installed"
  # sudo /nix/nix-installer uninstall --no-confirm
else
  echo "Installing Nix"
  curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sudo sh -s -- install linux \
    --init none \
    --extra-conf "sandbox = false" \
    --no-start-daemon \
    --no-confirm
fi

# # sudo which nix-build
# env
# echo $PATH
# sudo env
# # ls -la /nix/var/nix/profiles/default/bin/

# # install nix portable
# sudo curl -L https://github.com/DavHau/nix-portable/releases/download/v009/nix-portable -o /usr/local/bin/nix-portable
# sudo chmod +x /usr/local/bin/nix-portable

# export NP_DEBUG=2
# export NP_RUNTIME=proot

# nix-build --version
# ENV PATH="${PATH}:/nix/var/nix/profiles/default/bin"

sudo ls -la /nix/var/nix/profiles/default/bin/

env
sudo env

# sudo find / -name nix-build
# sudo find / -name nix

# which nix-build
# sudo which nix-build

# which nix
# sudo which nix

# /usr/local/sbin
# sudo which nix-build
# sudo nix-build --version

sudo chown buildbuddy:buildbuddy /nix

/nix/var/nix/profiles/default/bin/nix-build --version
sudo /nix/var/nix/profiles/default/bin/nix-build --version

sudo rm -fv /usr/local/sbin/nix-build 

sudo ln -f -s /nix/var/nix/profiles/default/bin/nix-build /usr/local/bin/nix-build

nix-build --version

# # which docker
# # docker --version

# # sudo curl -L https://hydra.nixos.org/job/nix/maintenance-2.14/buildStatic.x86_64-linux/latest/download-by-type/file/binary-dist -o /usr/local/bin/nix
# # sudo chmod +x /usr/local/bin/nix
# sudo ln -f -s $BUILD_WORKSPACE_DIRECTORY/nix-build /usr/local/sbin/nix-build

# /usr/local/bin/nix-build --version
# sudo /usr/local/bin/nix-build --version
# nix-build --version

# nix-build --version
