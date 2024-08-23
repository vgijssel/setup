{
  description = "Build and deployment of Bastion server";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
    nixos-generators = {
      url = "github:nix-community/nixos-generators";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    deploy-rs.url = "github:serokell/deploy-rs";
  };
  outputs = { self, nixpkgs, nixos-generators, deploy-rs, ... }: {

    # A single nixos config outputting multiple formats.
    # Alternatively put this in a configuration.nix.
    nixosModules.bastionFormats = { config, pkgs, ... }: {
      imports = [
        nixos-generators.nixosModules.all-formats
        ./configuration.nix
      ];

      nixpkgs.hostPlatform = "aarch64-linux";

      formatConfigs.qcow = { config, ... }: {
        # Enable cloud-init specifically for lima
        services.cloud-init.enable = true;
      };
    };

    nixosConfigurations.bastion = nixpkgs.lib.nixosSystem {
      modules = [ self.nixosModules.bastionFormats ];
    };

    deploy.nodes.bastion = {
      # Hardcoded port, also in: bastion-vm.yaml
      sshOpts = [ "-p" "63762" ];
      hostname = "host.docker.internal";
      profiles.system = {
        user = "root";
        sshUser = "root";
        path = deploy-rs.lib.aarch64-linux.activate.nixos self.nixosConfigurations.bastion.config.formats.qcow;
      };
    };

    # This is highly advised, and will prevent many possible mistakes
    checks = builtins.mapAttrs (system: deployLib: deployLib.deployChecks self.deploy) deploy-rs.lib;
  };
}
