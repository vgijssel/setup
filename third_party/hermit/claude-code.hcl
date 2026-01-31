description = "Claude Code is an agentic coding tool that lives in your terminal"
homepage = "https://github.com/anthropics/claude-code"
binaries = ["claude"]
test = "claude --version"
dont-extract = true

platform "darwin" "amd64" {
  source = "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/${version}/darwin-x64/claude"

  on "unpack" {
    chmod {
      file = "${root}/claude"
      mode = 493
    }
  }
}

platform "darwin" "arm64" {
  source = "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/${version}/darwin-arm64/claude"

  on "unpack" {
    chmod {
      file = "${root}/claude"
      mode = 493
    }
  }
}

platform "linux" "amd64" {
  source = "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/${version}/linux-x64/claude"

  on "unpack" {
    chmod {
      file = "${root}/claude"
      mode = 493
    }
  }
}

platform "linux" "arm64" {
  source = "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/${version}/linux-arm64/claude"

  on "unpack" {
    chmod {
      file = "${root}/claude"
      mode = 493
    }
  }
}

version "2.1.27" {
}

sha256sums = {
  "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/2.1.27/darwin-x64/claude": "cfc1ad5501ae9a2cb4b1b2e3755e5734b2f6b6114f671e527038d48327fb888c",
  "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/2.1.27/darwin-arm64/claude": "457dc3958139a356eeff23711074c45d393fb3c82e868bb7a1565ab7a5786f0c",
  "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/2.1.27/linux-x64/claude": "24df91dd250b6d7f6a0f8b256affab6c7a4bdefa64b1ece8aca3235d5f5e4044",
  "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/2.1.27/linux-arm64/claude": "6166a8eeb82eba410b96030ab4b1330a27c28bdbdc4e313db45e5bfcc25d1e66",
}
