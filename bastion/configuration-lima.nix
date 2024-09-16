# Edit this configuration file to define what should be installed on
# your system. Help is available in the configuration.nix(5) man page, on
# https://search.nixos.org/options and in the NixOS manual (`nixos-help`).

{ config, lib, pkgs, ... }:

{
  # Symlink bash to /bin/bash to make it work with lima/warp.
  system.activationScripts.binbash = ''
    mkdir -m 0755 -p /bin
    ln -sfn ${pkgs.bash}/bin/bash /bin/.bash.tmp
    mv /bin/.bash.tmp /bin/bash # atomically replace /bin/bash
  '';

  # Enable cloud-init specifically for lima
  services.cloud-init.enable = true;

  services.openssh.settings.PermitRootLogin = "yes";
  users.users.root.password = "nixos";

  security = {
    sudo.wheelNeedsPassword = false;
  };
}
