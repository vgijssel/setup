description = "VS Code Server for remote development"
homepage = "https://code.visualstudio.com/docs/remote/vscode-server"
binaries = ["bin/code-server-internal"]
strip = 1
test = "code-server-internal --version"

on "unpack" {
  rename {
    from = "${root}/bin/code-server"
    to = "${root}/bin/code-server-internal"
  }
}

// Version format: <semver>-<commit> to allow proper version ordering
// The commit is used in the download URL
//
// To add a new version:
// 1. Get the commit hash: curl -s "https://api.github.com/repos/microsoft/vscode/git/refs/tags/<version>" | jq -r '.object.sha'
// 2. Add a new version block below with platform-specific sources using the commit
// 3. Run: hermit manifest add-digests third_party/hermit/vscode-server.hcl
version "1.108.2-c9d77990917f3102ada88be140d28b038d1dd7c7" {
  platform "darwin" "amd64" {
    source = "https://vscode.download.prss.microsoft.com/dbazure/download/stable/c9d77990917f3102ada88be140d28b038d1dd7c7/vscode-server-darwin-x64.zip"
  }
  platform "darwin" "arm64" {
    source = "https://vscode.download.prss.microsoft.com/dbazure/download/stable/c9d77990917f3102ada88be140d28b038d1dd7c7/vscode-server-darwin-arm64.zip"
  }
  platform "linux" "amd64" {
    source = "https://vscode.download.prss.microsoft.com/dbazure/download/stable/c9d77990917f3102ada88be140d28b038d1dd7c7/vscode-server-linux-x64.tar.gz"
  }
  platform "linux" "arm64" {
    source = "https://vscode.download.prss.microsoft.com/dbazure/download/stable/c9d77990917f3102ada88be140d28b038d1dd7c7/vscode-server-linux-arm64.tar.gz"
  }
}

sha256sums = {
  "https://vscode.download.prss.microsoft.com/dbazure/download/stable/c9d77990917f3102ada88be140d28b038d1dd7c7/vscode-server-linux-x64.tar.gz": "6d49ccf9e762b560988a2a91de6948c38051acce601dde93d863bae552930d21",
  "https://vscode.download.prss.microsoft.com/dbazure/download/stable/c9d77990917f3102ada88be140d28b038d1dd7c7/vscode-server-darwin-x64.zip": "3c537257c2980f2730a3efbf00d1762407376b250c9dae3ab84ef96c78fb67c7",
  "https://vscode.download.prss.microsoft.com/dbazure/download/stable/c9d77990917f3102ada88be140d28b038d1dd7c7/vscode-server-darwin-arm64.zip": "73ced1135dce74cba1cceb63b5e77b90cd3d9de93eee8468e9e83be487a9cc45",
  "https://vscode.download.prss.microsoft.com/dbazure/download/stable/c9d77990917f3102ada88be140d28b038d1dd7c7/vscode-server-linux-arm64.tar.gz": "8fa156123463c8fc84b760bffba1bead4dfde9648174933afd00c9dfa124053d",
}
