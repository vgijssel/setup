description = "Protects your Pants from the elements."
binaries = ["pants"]
test = "pants --help"
runtime-dependencies = ["python3@3.10"]
dont-extract = true
source = "https://github.com/pantsbuild/scie-pants/releases/download/v${version}/scie-pants-${os}-${xarch}"


linux {
  source = "https://github.com/pantsbuild/scie-pants/releases/download/v${version}/scie-pants-linux-${xarch}"

  on "unpack" {
    rename {
      from = "${root}/scie-pants-linux-${xarch}"
      to = "${root}/pants"
    }

    chmod {
      file = "${root}/pants"
      mode = 493
    }
  }
}

darwin {
  source = "https://github.com/pantsbuild/scie-pants/releases/download/v${version}/scie-pants-macos-${xarch}"

  on "unpack" {
    rename {
      from = "${root}/scie-pants-macos-${xarch}"
      to = "${root}/pants"
    }

    chmod {
      file = "${root}/pants"
      mode = 493
    }
  }
}

version "0.12.2" {
  auto-version {
    github-release = "pantsbuild/scie-pants"
  }
}

sha256sums = {
  "https://github.com/pantsbuild/scie-pants/releases/download/v0.12.2/scie-pants-linux-x86_64": "be290b5c3b931a1f8dcdfbdd4dce12e28a7a94dd87c3c40dac4a326896365a20",
  "https://github.com/pantsbuild/scie-pants/releases/download/v0.12.2/scie-pants-macos-x86_64": "8565ab435baaf6c81f823301c35840a4b8425f2dc716e0ad3af6283758ddbdd0",
  "https://github.com/pantsbuild/scie-pants/releases/download/v0.12.2/scie-pants-macos-aarch64": "286da06c67445535f6d74e962c2fda98e8842fe649f16b5151f64d4ba894c785",
}
