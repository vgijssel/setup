terraform {
  required_version = ">= 1.8.0"

  required_providers {
    hcloud = {
      source = "hetznercloud/hcloud"
      # 1.66.0 (not the repo's 1.57.0): 1.57 predates Hetzner's 2025-12-16
      # datacenter deprecation and fails to read `location` back into state,
      # forcing a perpetual server replacement. 1.66 handles location correctly.
      version = "1.66.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "4.52.9"
    }
    ct = {
      source  = "poseidon/ct"
      version = "0.13.0"
    }
  }
}
