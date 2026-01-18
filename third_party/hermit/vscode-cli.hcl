binaries = ["code"]
test = "code --version"

platform "darwin" "amd64" {
  source = "https://update.code.visualstudio.com/${version}/cli-${os}-x64/stable"
}

platform "darwin" "arm64" {
  source = "https://update.code.visualstudio.com/${version}/cli-${os}-${arch}/stable"
}

platform "linux" "amd64" {
  source = "https://update.code.visualstudio.com/${version}/cli-${os}-x64/stable"
}

platform "linux" "arm64" {
  source = "https://update.code.visualstudio.com/${version}/cli-${os}-${arch}/stable"
}

description = "Visual Studio Code command line interface"
homepage = "https://code.visualstudio.com"

version "1.108.0" {
}

sha256sums = {
  "https://update.code.visualstudio.com/1.108.0/cli-linux-arm64/stable": "15806551389db3db8cc42844e68df3960de26a54f8acb5e52ce49a73fd946326",
  "https://update.code.visualstudio.com/1.108.0/cli-linux-x64/stable": "fb4ed45f106a43d9f0d059dae095e41a8d7e689557e792fa0efa332699deeefb",
  "https://update.code.visualstudio.com/1.108.0/cli-darwin-x64/stable": "ec5aa906696326358329b8f51e2eea57459b60430cbbf129f570d58be52335e3",
  "https://update.code.visualstudio.com/1.108.0/cli-darwin-arm64/stable": "0450b7e52d0f245918982f4c8ea333fb972a3ab39489ca7ecf634a7ca497e6eb",
}
