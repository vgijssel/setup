import ./docker.nix { pkgs = nixpkgs.legacyPackages.aarch64-darwin; };

#     # Cross build
#     # packages.${localSystem}."${name}-${crossSystem}" = drv { import nixpkgs { localSystem = localSystem; crossSystem = crossSystem;}
#     packages.aarch64-darwin.containerImage-x86_64-linux = import ./docker.nix { pkgs = import nixpkgs { localSystem = "aarch64-darwin"; crossSystem = "x86_64-linux"; }; };
#   };
# in
# outputs
