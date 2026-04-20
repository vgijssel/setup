description = "Claude Code is an agentic coding tool that lives in your terminal"
homepage = "https://github.com/anthropics/claude-code"
binaries = ["claude"]
test = "claude --version"
dont-extract = true

env = {
  "DISABLE_AUTOUPDATER": "1",
  "DISABLE_INSTALLATION_CHECKS": "1",
}

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

version "2.1.73" {
}

version "2.1.114" {
}

sha256sums = {
  "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/2.1.27/darwin-x64/claude": "cfc1ad5501ae9a2cb4b1b2e3755e5734b2f6b6114f671e527038d48327fb888c",
  "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/2.1.27/darwin-arm64/claude": "457dc3958139a356eeff23711074c45d393fb3c82e868bb7a1565ab7a5786f0c",
  "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/2.1.27/linux-x64/claude": "24df91dd250b6d7f6a0f8b256affab6c7a4bdefa64b1ece8aca3235d5f5e4044",
  "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/2.1.27/linux-arm64/claude": "6166a8eeb82eba410b96030ab4b1330a27c28bdbdc4e313db45e5bfcc25d1e66",
  "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/2.1.73/darwin-x64/claude": "3b03e15e3e809ada49e5a4125eb36508585b6d5adcd715b23d1ca3bedeb2a4e9",
  "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/2.1.73/darwin-arm64/claude": "5d402f804dde699c3824e93fefc198d81a52947a43e578286ea01cea9c029a73",
  "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/2.1.73/linux-x64/claude": "960cd0d71a225f3b946bb49dd5c19624c558077d9cf3da4eb570380b43135b7d",
  "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/2.1.73/linux-arm64/claude": "7a9d6851c57df4af7ac2800817a81970cf17c388e02d3749610d2fe199c2d0f0",
  "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/2.1.114/darwin-x64/claude": "1a30360b6240056a58ba9187c8f9d2e88e949e0f970d5cf81f8d69bc65568f6a",
  "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/2.1.114/darwin-arm64/claude": "bf1b4da368da7970f0d1d4a1675acea99b6f2ad94f24e9f8ccfcc7940ac67894",
  "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/2.1.114/linux-x64/claude": "12bd4b0916deb06be17ffc7b2f0485e140bf00b2db3dcb78469d66723d73c27f",
  "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/2.1.114/linux-arm64/claude": "9556b74e2c912e7dcaef90c91fd0dd5095364f8a9d71398de3c5c669612b828a",
}
