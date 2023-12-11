# { pkgs ? import <nixpkgs> { }
# , pkgsLinux ? import <nixpkgs> { system = "x86_64-linux"; }
# }:

{ targetArch }:

let
  localPkgs = import <nixpkgs> { };
  # pkgs = nixpkgs.legacyPackages.aarch64-darwin;
  # pkgs = import <nixpkgs> { localSystem = "aarch64-darwin"; crossSystem = "x86_64-linux"; };
  # pkgs = import <nixpkgs> { localSystem = "aarch64-darwin"; };
  # targetPkgs = import <nixpkgs> { system = "x86_64-linux"; };
  targetPkgs = import <nixpkgs> { system = targetArch + "-linux"; };
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

  testBaseImage = localPkgs.dockerTools.buildLayeredImage {
    name = "test_base_image";
    tag = "latest";
    created = "now";
    # architecture = "aarch64";
    # architecture = "x86_64";
    architecture = targetArch;
    maxLayers = 2;
    config = {
      Cmd = [ "${targetPkgs.bashInteractive}/bin/bash" ];
    };
    contents = [
      targetPkgs.busybox
      targetPkgs.bashInteractive
      # crossPkgs.python310
      # crossPkgs.stdenv.cc.cc.lib
      # crossPkgs.cacert
    ];
  };
in
localPkgs.runCommand "testBaseImage" { } ''
  mkdir -p $out
  gunzip -c ${testBaseImage} > $out/image.tar.gz
''

