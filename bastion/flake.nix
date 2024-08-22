{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
    nixos-generators = {
      url = "github:nix-community/nixos-generators";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };
  outputs = { self, nixpkgs, nixos-generators, ... }: {

    # A single nixos config outputting multiple formats.
    # Alternatively put this in a configuration.nix.
    nixosModules.myFormats = { config, pkgs, ... }: {
      imports = [
        nixos-generators.nixosModules.all-formats
      ];

      # TODO: how to handle this platform in CI? Can we cross compile?
      nixpkgs.hostPlatform = "aarch64-linux";
      system.stateVersion = "24.05";

      environment.systemPackages = with pkgs; [
        vim
      ];

      formatConfigs.docker = { config, ... }: {
        services.openssh.enable = true;
      };

      formatConfigs.raw = { config, ... }: {
        services.openssh.enable = true;
      };

      # customize an existing format
      formatConfigs.qcow = { config, ... }: {
        services.openssh.enable = true;
      };

      # define a new format
      formatConfigs.my-custom-format = { config, modulesPath, ... }: {
        imports = [ "${toString modulesPath}/installer/cd-dvd/installation-cd-base.nix" ];
        formatAttr = "isoImage";
        fileExtension = ".iso";
        networking.wireless.networks = {
          # ...
        };
      };
    };

    # a machine consuming the module
    nixosConfigurations.bastion = nixpkgs.lib.nixosSystem {
      modules = [ self.nixosModules.myFormats ];
    };
  };
}
