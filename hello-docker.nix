# { pkgs ? import <nixpkgs> { }
# , pkgsLinux ? import <nixpkgs> { system = "x86_64-linux"; }
# }:

# pkgs.dockerTools.buildImage {
#   name = "hello-docker";
#   config = {
#     Cmd = [ "${pkgsLinux.hello}/bin/hello" ];
#   };
# }

# We need a remote builder to be able to build docker images on macOS
# The remote builder is setup with 
# nix run --extra-experimental-features nix-command --extra-experimental-features flakes nixpkgs#darwin.linux-builder
# Documentation for the darwin builder https://nixos.org/manual/nixpkgs/stable/#chap-special
# How do we connect to the remote builder now?
# We can setup https://github.com/LnL7/nix-docker? As a remote builder machine?


let
  # pkgs = import <nixpkgs> { system = "x86_64-linux"; };
  pkgs = import <nixpkgs> { system = "aarch64-linux"; };
  # pkgs = (import <nixpkgs> {}).pkgsCross.aarch64-multiplatform;

  # scienv = pkgs.python3.withPackages (ps: with ps; [ numpy scipy ]);
in
rec {
  jax = pkgs.dockerTools.buildImage {
    name = "hello-docker";
    tag = "latest";
    copyToRoot = pkgs.buildEnv {
      name = "image-root";
      paths = with pkgs; [
        coreutils
        bashInteractive
        moreutils

        # scienv
      ];
      pathsToLink = [ "/bin" ];
    };
  };
}
