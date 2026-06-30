terraform {
  required_version = ">= 1.8.0"

  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "1.57.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "4.52.0"
    }
    ct = {
      source  = "poseidon/ct"
      version = "0.13.0"
    }
  }
}
