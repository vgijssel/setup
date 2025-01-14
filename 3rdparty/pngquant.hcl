description = "Lossy PNG compressor — pngquant command based on libimagequant library"
binaries = ["pngquant"]
test = "pngquant --version"
source = "https://github.com/helmfile/vals/releases/download/v${version}/vals_${version}_${os}_${arch}.tar.gz"

channel "latest" {
  update = "24h"

  linux {
    source = "https://pngquant.org/pngquant-linux.tar.bz2"
  }

  darwin {
    source = "https://pngquant.org/pngquant.tar.bz2"
  }
}