# { pkgs ? import <nixpkgs> { }
# , pkgsLinux ? import <nixpkgs> { system = "x86_64-linux"; }
# }:

let
  kerk = import <nixpkgs> { };
  # pkgs = nixpkgs.legacyPackages.aarch64-darwin;
  # pkgs = import <nixpkgs> { localSystem = "aarch64-darwin"; crossSystem = "x86_64-linux"; };
  pkgs = import <nixpkgs> { localSystem = "aarch64-darwin"; };
  targetPkgs = import <nixpkgs> { system = "x86_64-linux"; };
  # targetPkgs = import <nixpkgs> { system = "aarch64-linux"; };
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
    name = "myimage";
    tag = "latest";
    created = "now";
    # architecture = "aarch64";
    architecture = "x86_64";
    maxLayers = 2;
    config = {
      Cmd = [ "${targetPkgs.bashInteractive}/bin/bash" ];
    };
    contents = [
      # pkgs.busybox
      targetPkgs.bashInteractive
      # crossPkgs.python310
      # crossPkgs.stdenv.cc.cc.lib
      # crossPkgs.cacert
    ];
  };
in
pythonBase

