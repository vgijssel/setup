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
    packages.aarch64-linux = {
      qcow = nixos-generators.nixosGenerate {
        system = "aarch64-linux";
        modules = [
          ./configuration.nix
          ./configuration-lima.nix
        ];
        format = "qcow";
      };
    };

    nixosConfigurations.bastion = nixpkgs.lib.nixosSystem {
      system = "aarch64-linux";
      modules = [
        ./configuration.nix
        ./configuration-lima.nix
      ];
    };

    deploy.nodes.bastion = {
      # Hardcoded port, also in: bastion-vm.yaml
      sshOpts = [ "-p" "63762" ];
      hostname = "host.docker.internal";
      profiles.system = {
        user = "root";
        sshUser = "root";
        path = deploy-rs.lib.aarch64-linux.activate.nixos self.nixosConfigurations.bastion;
      };
    };

    # This is highly advised, and will prevent many possible mistakes
    checks = builtins.mapAttrs (system: deployLib: deployLib.deployChecks self.deploy) deploy-rs.lib;
  };
}
