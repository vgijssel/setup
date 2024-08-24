# Edit this configuration file to define what should be installed on
# your system. Help is available in the configuration.nix(5) man page, on
# https://search.nixos.org/options and in the NixOS manual (`nixos-help`).

{ config, lib, pkgs, ... }:

{
  system.stateVersion = "24.05";
  nix.settings.experimental-features = [ "nix-command" "flakes" ];
  services.openssh.enable = true;

  environment.systemPackages = with pkgs; [
    vim
    wget
    goss
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

  systemd.services.goss = {
    description = "Goss Healthcheck Service";
    wantedBy = [ "default.target" ];
    serviceConfig = {
      ExecStart = "${pkgs.goss}/bin/goss --gossfile ${./goss.yaml} serve";
    };
  };
}
