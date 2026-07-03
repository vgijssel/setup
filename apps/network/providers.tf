provider "hcloud" {
  # Token is automatically read from the HCLOUD_TOKEN environment variable.
}

provider "cloudflare" {
  # Also reads CLOUDFLARE_API_TOKEN from the environment; set explicitly for clarity.
  api_token = var.cloudflare_api_token
}
