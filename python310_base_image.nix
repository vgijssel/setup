let
  currentSystem = builtins.currentSystem;
  targetSystem = {
    "x86_64-linux" = "x86_64-linux";
    "aarch64-darwin" = "aarch64-linux";
    "aarch64-linux" = "aarch64-linux";
  }."${currentSystem}";
in
with import <nixpkgs>
{
  system = targetSystem;
};

let
  dockerEtc = runCommand "docker-etc" { } ''
    mkdir -p $out/etc/pam.d

    echo "root:x:0:0::/root:/bin/bash" > $out/etc/passwd
    echo "root:!x:::::::" > $out/etc/shadow
    echo "root:x:0:" > $out/etc/group
  '';

  pythonBase = dockerTools.buildLayeredImage {
    name = "python310-base-image-unwrapped";
    created = "now";
    maxLayers = 2;
    contents = [
      busybox
      bashInteractive
      python310
      stdenv.cc.cc.lib
      cacert
      dockerEtc
    ];
    extraCommands = ''
            mkdir -p root
            mkdir -p usr/bin
            ln -s /bin/env usr/bin/env
            cat <<-"EOF" > "usr/bin/python3"
      #!/bin/sh
      export LD_LIBRARY_PATH="/lib64:/lib"
      exec -a "$0" "/bin/python3" "$@"
      EOF
            chmod +x usr/bin/python3
            ln -s /usr/bin/python3 usr/bin/python
    '';
  };

in
runCommand "python310-base-image" { } ''
  mkdir -p $out
  gunzip -c ${pythonBase} > $out/image.tar.gz
''
