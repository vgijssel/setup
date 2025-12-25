description = "A build system and repo management tool for the web ecosystem, written in Rust"
homepage = "https://moonrepo.dev"
binaries = ["moon"]
test = "moon --version"
dont-extract = true

platform "darwin" "amd64" {
  source = "https://github.com/moonrepo/moon/releases/download/v${version}/moon-x86_64-apple-darwin"

  on "unpack" {
    rename {
      from = "${root}/moon-x86_64-apple-darwin"
      to = "${root}/moon"
    }

    chmod {
      file = "${root}/moon"
      mode = 493
    }
  }
}

platform "darwin" "arm64" {
  source = "https://github.com/moonrepo/moon/releases/download/v${version}/moon-aarch64-apple-darwin"

  on "unpack" {
    rename {
      from = "${root}/moon-aarch64-apple-darwin"
      to = "${root}/moon"
    }

    chmod {
      file = "${root}/moon"
      mode = 493
    }
  }
}

platform "linux" "amd64" {
  source = "https://github.com/moonrepo/moon/releases/download/v${version}/moon-x86_64-unknown-linux-gnu"

  on "unpack" {
    rename {
      from = "${root}/moon-x86_64-unknown-linux-gnu"
      to = "${root}/moon"
    }

    chmod {
      file = "${root}/moon"
      mode = 493
    }
  }
}

platform "linux" "arm64" {
  source = "https://github.com/moonrepo/moon/releases/download/v${version}/moon-aarch64-unknown-linux-gnu"

  on "unpack" {
    rename {
      from = "${root}/moon-aarch64-unknown-linux-gnu"
      to = "${root}/moon"
    }

    chmod {
      file = "${root}/moon"
      mode = 493
    }
  }
}

version "1.41.8" {
  auto-version {
    github-release = "moonrepo/moon"
  }
}

sha256sums = {
  "https://github.com/moonrepo/moon/releases/download/v1.41.8/moon-x86_64-unknown-linux-gnu": "c729a3aefa5afdaf4a915cb4c816dca789f9c1f31574644135506ed90d9515aa",
  "https://github.com/moonrepo/moon/releases/download/v1.41.8/moon-x86_64-apple-darwin": "58a414a08359e770137c94e166831f293e026f49666d9995bac968af5edef610",
  "https://github.com/moonrepo/moon/releases/download/v1.41.8/moon-aarch64-apple-darwin": "3cf3e897f8fe900ce72b5187e5346d60e6659f0b9e234b3522045df4a7aa2c2c",
  "https://github.com/moonrepo/moon/releases/download/v1.41.8/moon-aarch64-unknown-linux-gnu": "83e20e3cd787219e8d9fe00d70a7e4fdcfe389ca83914485e5593c330eefb427",
}
