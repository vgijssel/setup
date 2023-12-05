# { pkgs ? import <nixpkgs> { }
# , pkgsLinux ? import <nixpkgs> { system = "x86_64-linux"; }
# }:

let
  kerk = import <nixpkgs> { };
  # pkgs = nixpkgs.legacyPackages.aarch64-darwin;
  pkgs = import <nixpkgs> { localSystem = "aarch64-darwin"; crossSystem = "x86_64-linux"; };
  # pkgs = import <nixpkgs> { };
  # pkgsLinux = import <nixpkgs> { system = "x86_64-linux"; };

  # pkgs.pkgsCross.musl64.hello
  # crossPkgs = nixpkgs.pkgsCross.aarch64-multiplatform;
  # crossPkgs = nixpkgs.pkgsCross.gnu64;

  # crossPkgs = (nixpkgs {
  #   crossSystem = { config = "aarch64-unknown-linux-musl"; };
  # }).pkgsStatic;

  # myImage = pkgs.dockerTools.buildImage
  #   {
  #     name = "hello-docker";
  #     tag = [ "latest" ];
  #     config = {
  #       Cmd = [ "${pkgsLinux.hello}/bin/hello" ];
  #     };
  #   };

  pythonBase = kerk.dockerTools.buildLayeredImage {
    name = "python310-base-image-unwrapped";
    created = "now";
    maxLayers = 2;
    contents = [
      # pkgs.busybox
      pkgs.bashInteractive
      # crossPkgs.python310
      # crossPkgs.stdenv.cc.cc.lib
      # crossPkgs.cacert
    ];
  };
in
pythonBase

