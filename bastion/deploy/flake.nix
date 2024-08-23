{
  description = "Deployment for my server cluster";

  # For accessing `deploy-rs`'s utility Nix functions
  inputs.deploy-rs.url = "github:serokell/deploy-rs";

  outputs = { self, nixpkgs, deploy-rs }: {
    nixosConfigurations.bastion = nixpkgs.lib.nixosSystem {
      #   system = "x86_64-linux";
      system = "aarch64-linux";
      modules = [ ./configuration.nix ];
    };

    deploy.nodes.bastion = {
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
