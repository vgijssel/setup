# Edit this configuration file to define what should be installed on
# your system. Help is available in the configuration.nix(5) man page, on
# https://search.nixos.org/options and in the NixOS manual (`nixos-help`).

{ config, lib, pkgs, ... }:

{
  # TODO: how to handle this platform in CI? Can we cross compile?
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
    wget
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

  # qcow specific settings
  services.cloud-init.enable = true;

  # Make sure /bin/bash exists
  # services.envfs.enable = true;

  services.openssh.settings.PermitRootLogin = "yes";
  users.users.root.password = "nixos";

  security = {
    sudo.wheelNeedsPassword = false;
  };

  users.users.ops = {
    isNormalUser = true;
    extraGroups = [ "wheel" ]; # Add the user to the wheel group if you want them to have sudo access.
    password = "ops";
  };
}
