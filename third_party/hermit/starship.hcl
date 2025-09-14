description = "The minimal, blazing-fast, and infinitely customizable prompt for any shell!"
homepage = "https://starship.rs"
binaries = ["starship"]
test = "starship --version"

platform "darwin" "amd64" {
  source = "https://github.com/starship/starship/releases/download/v${version}/starship-x86_64-apple-darwin.tar.gz"
}

platform "darwin" "arm64" {
  source = "https://github.com/starship/starship/releases/download/v${version}/starship-aarch64-apple-darwin.tar.gz"
}

platform "linux" "amd64" {
  source = "https://github.com/starship/starship/releases/download/v${version}/starship-x86_64-unknown-linux-musl.tar.gz"
}

platform "linux" "arm64" {
  source = "https://github.com/starship/starship/releases/download/v${version}/starship-aarch64-unknown-linux-musl.tar.gz"
}

version "1.23.0" {
  auto-version {
    github-release = "starship/starship"
  }
}

sha256sums = {
  "https://github.com/starship/starship/releases/download/v1.23.0/starship-x86_64-apple-darwin.tar.gz": "8cac7a18fb1faf0aec50bd221dd71ecc8553850d99c212231851ae64ba11f089",
  "https://github.com/starship/starship/releases/download/v1.23.0/starship-aarch64-apple-darwin.tar.gz": "042c8001275316836a3c43fdb88d0787395edfd0c10d209e4892ab5577b80d57",
  "https://github.com/starship/starship/releases/download/v1.23.0/starship-x86_64-unknown-linux-musl.tar.gz": "8d06d2cc67aedd6316ff58ab679fb80cded0d85de1dcd5727df0633d35356d57",
  "https://github.com/starship/starship/releases/download/v1.23.0/starship-aarch64-unknown-linux-musl.tar.gz": "d37040138c68b5f3334bbe16d4615f0a83829deebecc5d014e779c302e8270d8",
}