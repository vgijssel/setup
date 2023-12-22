# Edit this configuration file to define what should be installed on
# your system. Help is available in the configuration.nix(5) man page, on
# https://search.nixos.org/options and in the NixOS manual (`nixos-help`).

{ config, lib, pkgs, ... }:

{
  imports =
    [ # Include the results of the hardware scan.
      ./hardware-configuration.nix
    ];

  # Use the GRUB 2 boot loader.
  # boot.loader.grub.enable = true;
  boot.loader.systemd-boot.enable = true;
  # boot.loader.grub.efiSupport = true;
  # boot.loader.grub.efiInstallAsRemovable = true;
  # boot.loader.efi.efiSysMountPoint = "/boot/efi";
  # Define on which hard drive you want to install Grub.
  # boot.loader.grub.device = "/dev/sda"; # or "nodev" for efi only

boot.zfs.extraPools = [ "new_data" ];


boot.supportedFilesystems = [ "zfs" ];
boot.zfs.forceImportRoot = false;
networking.hostId = "8090765d";
networking.hostName = "hypervisor"; # Define your hostname.
networking.useDHCP = false;

networking.bridges = {
  "br0" = {
    interfaces = ["eno1"];
  };
};

networking.interfaces.br0.ipv4.addresses = [ {
    address = "192.168.1.30";
    prefixLength = 24;
  } ];
networking.defaultGateway = "192.168.1.1";
networking.nameservers = ["192.168.1.1"];

# Disable the configuration for eth0 (if it was previously configured)
networking.interfaces.eno1.useDHCP = false;
networking.interfaces.eno1.ipv4 = {};

  networking.firewall.allowedTCPPorts = [
    6443 # k3s: required so that pods can reach the API server (running on port 6443 by default)
    8123 # for homeassistant running in host networking mode
    21063 # for homekit bridge
    21064 # for baby cam
    21065 # for driveway cam
    6052 # for esphome
  ];

  networking.firewall.allowedUDPPorts = [
	5353 # for homekit bridge
  ];

  services.k3s.enable = true;
  services.k3s.role = "server";

  systemd.services.k3s.path = [ pkgs.ipset ];

# services.localtimed.enable = true;
#  services.geoclue2.enable = true;

time.timeZone = "Europe/Amsterdam";



    # 2379 # k3s, etcd clients: required if using a "High Availability Embedded etcd" configuration
    # 2380 # k3s, etcd peers: required if using a "High Availability Embedded etcd" configuration
  #services.k3s.extraFlags = toString [
    # "--kubelet-arg=v=4" # Optionally add additional args to k3s
  #];
  # Pick only one of the below networking options.
  # networking.wireless.enable = true;  # Enables wireless support via wpa_supplicant.
  # networking.networkmanager.enable = true;  # Easiest to use and most distros use this by default.

  # Set your time zone.
  # time.timeZone = "Europe/Amsterdam";

  # Configure network proxy if necessary
  # networking.proxy.default = "http://user:password@proxy:port/";
  # networking.proxy.noProxy = "127.0.0.1,localhost,internal.domain";

  # Select internationalisation properties.
  # i18n.defaultLocale = "en_US.UTF-8";
  # console = {
  #   font = "Lat2-Terminus16";
  #   keyMap = "us";
  #   useXkbConfig = true; # use xkb.options in tty.
  # };

  # Enable the X11 windowing system.
  # services.xserver.enable = true;


  

  # Configure keymap in X11
  # services.xserver.xkb.layout = "us";
  # services.xserver.xkb.options = "eurosign:e,caps:escape";

  # Enable CUPS to print documents.
  # services.printing.enable = true;

  # Enable sound.
  # sound.enable = true;
  # hardware.pulseaudio.enable = true;

  # Enable touchpad support (enabled default in most desktopManager).
  # services.xserver.libinput.enable = true;

  # Define a user account. Don't forget to set a password with ‘passwd’.
  users.users.maarten = {
    isNormalUser = true;
    extraGroups = [ "wheel" "docker" ]; # Enable ‘sudo’ for the user.
    home = "/home/maarten";
    openssh.authorizedKeys.keys  = [ "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAxlxnzhmyhG8wT+LOc24GkJ9QSw9Mt2kbLWDcf5EeFm" ];
  };

  # List packages installed in system profile. To search, run:
  # $ nix search wget
  environment.systemPackages = with pkgs; [
    vim # Do not forget to add an editor to edit configuration.nix! The Nano editor is also installed by default.
    wget
    k3s
    kubevirt
bridge-utils
docker-compose 
mutagen
  ];

virtualisation.docker.enable = true;


  # Some programs need SUID wrappers, can be configured further or are
  # started in user sessions.
  # programs.mtr.enable = true;
  # programs.gnupg.agent = {
  #   enable = true;
  #   enableSSHSupport = true;
  # };

  # List services that you want to enable:
services.openssh = {
  enable = true;
  # require public key authentication for better security
  settings.PasswordAuthentication = false;
  settings.KbdInteractiveAuthentication = false;
  # disable root login
  settings.PermitRootLogin = "no";
};


  security.sudo.enable = true;
  security.pam.enableSSHAgentAuth = true;
  security.pam.services.sudo.sshAgentAuth = true;

systemd.tmpfiles.rules = [ 
  "L /etc/cni/net.d - - - - /var/lib/rancher/k3s/agent/etc/cni/net.d" 
  "L /opt/cni/bin   - - - - /var/lib/rancher/k3s/data/current/bin" 
];



  # Open ports in the firewall.
  # networking.firewall.allowedTCPPorts = [ ... ];
  # networking.firewall.allowedUDPPorts = [ ... ];
  # Or disable the firewall altogether.
  # networking.firewall.enable = false;

  # Copy the NixOS configuration file and link it from the resulting system
  # (/run/current-system/configuration.nix). This is useful in case you
  # accidentally delete configuration.nix.
  # system.copySystemConfiguration = true;

  # This option defines the first version of NixOS you have installed on this particular machine,
  # and is used to maintain compatibility with application data (e.g. databases) created on older NixOS versions.
  #
  # Most users should NEVER change this value after the initial install, for any reason,
  # even if you've upgraded your system to a new NixOS release.
  #
  # This value does NOT affect the Nixpkgs version your packages and OS are pulled from,
  # so changing it will NOT upgrade your system.
  #
  # This value being lower than the current NixOS release does NOT mean your system is
  # out of date, out of support, or vulnerable.
  #
  # Do NOT change this value unless you have manually inspected all the changes it would make to your configuration,
  # and migrated your data accordingly.
  #
  # For more information, see `man configuration.nix` or https://nixos.org/manual/nixos/stable/options#opt-system.stateVersion .
  system.stateVersion = "23.11"; # Did you read the comment?

}

