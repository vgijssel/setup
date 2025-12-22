description = "A modern runtime for JavaScript and TypeScript"
homepage = "https://deno.land"
binaries = ["deno"]

platform "darwin" "amd64" {
  source = "https://github.com/denoland/deno/releases/download/v${version}/deno-x86_64-apple-darwin.zip"
}

platform "darwin" "arm64" {
  source = "https://github.com/denoland/deno/releases/download/v${version}/deno-aarch64-apple-darwin.zip"
}

platform "linux" "amd64" {
  source = "https://github.com/denoland/deno/releases/download/v${version}/deno-x86_64-unknown-linux-gnu.zip"
}

platform "linux" "arm64" {
  source = "https://github.com/denoland/deno/releases/download/v${version}/deno-aarch64-unknown-linux-gnu.zip"
}

version "2.6.3" {
  auto-version {
    github-release = "denoland/deno"
  }
}

sha256sums = {
  "https://github.com/denoland/deno/releases/download/v2.6.3/deno-aarch64-apple-darwin.zip": "7fdc01002a90a6ac58b8936e5d7a872fa7885db71d51bac7f776b7b790c82085",
  "https://github.com/denoland/deno/releases/download/v2.6.3/deno-x86_64-apple-darwin.zip": "3942e5af4d25588b506f49155278239c9fa09e7683a912ca091a346a1fc40733",
  "https://github.com/denoland/deno/releases/download/v2.6.3/deno-aarch64-unknown-linux-gnu.zip": "92c9496e8c71e6b18abf1f728d6223bb682749e4946f24589a7ef8972fec423e",
  "https://github.com/denoland/deno/releases/download/v2.6.3/deno-x86_64-unknown-linux-gnu.zip": "b3c24dc6f3982607896bd795fd6bcbdc53f3d11e8d8190b2a07fd1881eb1148a",
}
