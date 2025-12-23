{ targetArch }:

let
  localPkgs = import <nixpkgs> { };
  targetPkgs = import <nixpkgs> { system = targetArch + "-linux"; };

  dockerEtc = localPkgs.runCommand "docker-etc" { } ''
    mkdir -p $out/etc/pam.d

    echo "root:x:0:0::/root:/bin/bash" > $out/etc/passwd
    echo "root:!x:::::::" > $out/etc/shadow
    echo "root:x:0:" > $out/etc/group
  '';

  pythonBaseImage = localPkgs.dockerTools.buildLayeredImage {
    name = "python_base_image";
    tag = "latest";
    created = "now";
    architecture = targetArch;
    maxLayers = 2;
    contents = [
      targetPkgs.busybox
      targetPkgs.bashInteractive
      targetPkgs.python311
      targetPkgs.stdenv.cc.cc.lib
      targetPkgs.cacert
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
localPkgs.runCommand "pythonBaseImage" { } ''
  mkdir -p $out
  gunzip -c ${pythonBaseImage} > $out/image.tar.gz
''

