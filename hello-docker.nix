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

# with import <nixpkgs> { system = "aarch64-linux"; };
with import <nixpkgs> { system = "aarch64-linux"; };

let
  # pkgs = import <nixpkgs> { system = "x86_64-linux"; };
  # pkgs = import <nixpkgs> { system = "aarch64-linux"; };
  # pkgs = (import <nixpkgs> {}).pkgsCross.aarch64-multiplatform;
  # scienv = pkgs.python3.withPackages (ps: with ps; [ numpy scipy ]);
  jax = pkgs.dockerTools.buildImage {
    name = "hello-docker";
    tag = "latest";
    copyToRoot = pkgs.buildEnv {
      name = "image-root";
      paths = with pkgs; [
        coreutils
        bashInteractive
        moreutils
        lefthook
        vim

        # scienv
      ];
      pathsToLink = [ "/bin" ];
      # extraCommands = ''
      #         mkdir -p root
      #         mkdir -p usr/bin
      #         ln -s /bin/env usr/bin/env
      #         cat <<-"EOF" > "usr/bin/python3"
      #   #!/bin/sh
      #   export LD_LIBRARY_PATH="/lib64:/lib"
      #   exec -a "$0" "/bin/python3" "$@"
      #   EOF
      #         chmod +x usr/bin/python3
      #         ln -s /usr/bin/python3 usr/bin/python
      # '';
    };
  };
in
runCommand "python38-base-image" { } ''
  mkdir -p $out
  gunzip -c ${jax} > $out/image
''
