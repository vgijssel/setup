description = "Install and Run Python Applications in Isolated Environments"
binaries = ["kerk"]
runtime-dependencies = ["python3@3.10"]
dont-extract = true
source = "file:///Users/maarten/Development/setup/kerk.json"

on "unpack" {
    copy {
        from = "kerk.sh"
        to = "${root}/kerk"
    }

  chmod {
    file = "${root}/kerk"
    mode = 448
  }
}

# channel "dev" {
#     update = "1h"
# }

version "0-somesha-4" {}

# version "0-somesha-2" {}

# version "0-somesha-3" {}

# version "1.7.1" {
  # auto-version {
    # github-release = "pypa/pipx"
  # }
# }

# sha256sums = {
# "https://github.com/pypa/pipx/releases/download/1.7.1/pipx.pyz": "1d4f46f86830640f1d7c4e29b280a7a42265d6e8af2c063f40baed4513f03ae8"
# }
