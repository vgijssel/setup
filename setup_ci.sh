#!/bin/sh

set -x
set -e



# if [ -f /nix/receipt.json ]; then
#   echo "Uninstall nix as it's already here"
#   sudo /nix/nix-installer uninstall --no-confirm
# else
#   echo "No nix here"
#   # echo "Installing Nix"

#   # curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install linux \
#   #   --init none \
#   #   --extra-conf "sandbox = false" \
#   #   --no-start-daemon \
#   #   --no-confirm
# fi

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

# sudo ln -f -s $BUILD_WORKSPACE_DIRECTORY/nix-build /usr/local/bin/nix-build

sudo curl -L https://hydra.nixos.org/job/nix/maintenance-2.14/buildStatic.x86_64-linux/latest/download-by-type/file/binary-dist -o /usr/local/bin/nix
sudo chmod +x /usr/local/bin/nix
sudo ln -f -s $BUILD_WORKSPACE_DIRECTORY/nix-build /usr/local/bin/nix-build

nix-build --version
