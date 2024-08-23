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
  };
}
