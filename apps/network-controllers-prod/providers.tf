provider "hcloud" {
  # Token is automatically read from HCLOUD_TOKEN environment variable
}

provider "cloudflare" {
  # Also reads CLOUDFLARE_API_TOKEN from the environment; set explicitly for clarity.
  api_token = var.cloudflare_api_token
}

provider "ct" {
  # Compiles Butane -> Ignition locally; no credentials required.
}
