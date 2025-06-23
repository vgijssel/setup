description = "Trunk CLI Launcher"
homepage = "https://github.com/trunk-io/trunk-launcher"
binaries = ["trunk"]
dont-extract = true

channel "latest" {
  source = "https://trunk.io/releases/trunk"
  update = "24h"

  on unpack { 
    chmod {
        file = "${root}/trunk"
        mode = 448
    }
  }
}