# This can be built with nixos-rebuild --flake .#myhost build
{
  description = "hypervisor";

  inputs = {
    nixpkgs = {
      url = "github:NixOS/nixpkgs/nixos-23.11";
    };
  };

  # Outputs can be anything, but the wiki + some commands define their own
  # specific keys. Wiki page: https://nixos.wiki/wiki/Flakes#Output_schema
  outputs = { self, nixpkgs }: {
    # nixosConfigurations is the key that nixos-rebuild looks for.
    nixosConfigurations = {
      hypervisor = nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";
        # Import our old system configuration.nix
        modules = [
          ./configuration.nix
        ];
      };
    };
  };
}
