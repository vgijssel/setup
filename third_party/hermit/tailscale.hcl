description = "The easiest, most secure way to use WireGuard and 2FA."
homepage = "https://tailscale.com"
binaries = ["tailscale", "tailscaled"]
source = "https://pkgs.tailscale.com/stable/tailscale_${version}_${arch}.tgz"
strip = 1

version "1.90.6" {
  auto-version {
    github-release = "tailscale/tailscale"
  }
}

sha256sums = {
  "https://pkgs.tailscale.com/stable/tailscale_1.90.6_amd64.tgz": "cc51b5b6fe86a25e66b2ef037334e799a61d06dc64fabcadfe6e2a7588a2b2c7",
  "https://pkgs.tailscale.com/stable/tailscale_1.90.6_arm64.tgz": "9792d1ded9d119b04c32c7e77475f89bcba57db14ba602ec2714c84ca9786608",
}
