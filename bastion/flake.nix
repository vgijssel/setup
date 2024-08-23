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

      boot.loader.grub = {
        device = "nodev";
        efiSupport = true;
        efiInstallAsRemovable = true;
      };

      fileSystems."/boot" = {
        device = "/dev/vda1"; # /dev/disk/by-label/ESP
        fsType = "vfat";
      };

      fileSystems."/" = {
        device = "/dev/disk/by-label/nixos";
        autoResize = true;
        fsType = "ext4";
        options = [ "noatime" "nodiratime" "discard" ];
      };

      # TODO: how to handle this platform in CI? Can we cross compile?
      nixpkgs.hostPlatform = "aarch64-linux";
      system.stateVersion = "24.05";
      nix.settings.experimental-features = [ "nix-command" "flakes" ];
      services.openssh.enable = true;

      # Symlink bash to /bin/bash to make it work with lima/warp.
      system.activationScripts.binbash = ''
        mkdir -m 0755 -p /bin
        ln -sfn ${pkgs.bash}/bin/bash /bin/.bash.tmp
        mv /bin/.bash.tmp /bin/bash # atomically replace /bin/bash
      '';

      environment.systemPackages = with pkgs; [
        vim
      ];

      formatConfigs.qcow = { config, ... }: {
        services.cloud-init.enable = true;

        # Make sure /bin/bash exists
        # services.envfs.enable = true;

        services.openssh.settings.PermitRootLogin = "yes";
        users.users.root.password = "nixos";

        security = {
          sudo.wheelNeedsPassword = false;
        };
      };
    };

    # a machine consuming the module
    nixosConfigurations.bastion = nixpkgs.lib.nixosSystem {
      modules = [ self.nixosModules.myFormats ];
    };
  };
}
