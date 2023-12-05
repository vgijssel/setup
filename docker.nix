{ pkgs }:

pkgs.dockerTools.buildLayeredImage {
  name = "python310-base-image-unwrapped";
  created = "now";
  maxLayers = 2;
  contents = [
    pkgs.busybox
    pkgs.bashInteractive
    # crossPkgs.python310
    # crossPkgs.stdenv.cc.cc.lib
    # crossPkgs.cacert
  ];
};
