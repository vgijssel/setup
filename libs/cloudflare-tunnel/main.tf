resource "random_id" "tunnel_suffix" {
  byte_length = 4
  prefix      = "${var.tunnel_name}-"
}

locals {
  tunnel_name     = random_id.tunnel_suffix.hex
  tunnel_hostname = "${var.tunnel_name}.${var.zone_name}"
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_zero_trust_tunnel_cloudflared" "tunnel" {
  account_id = var.cloudflare_account_id
  name       = local.tunnel_name
}

resource "cloudflare_zero_trust_tunnel_cloudflared_config" "tunnel_config" {
  account_id = var.cloudflare_account_id
  tunnel_id  = cloudflare_zero_trust_tunnel_cloudflared.tunnel.id

  config = {
    ingress = [
      {
        hostname = local.tunnel_hostname
        service  = var.tunnel_service
      },
      {
        service = "http_status:404"
      }
    ]
  }
}

data "cloudflare_zero_trust_tunnel_cloudflared_token" "tunnel_token" {
  account_id = var.cloudflare_account_id
  tunnel_id  = cloudflare_zero_trust_tunnel_cloudflared.tunnel.id
}

data "cloudflare_zones" "available" {
}

data "cloudflare_zone" "zone" {
  filter = {
    name = var.zone_name
  }

  lifecycle {
    postcondition {
      condition     = self.id != ""
      error_message = "Zone ${var.zone_name} must exist in Cloudflare"
    }
  }
}

resource "cloudflare_dns_record" "tunnel_cname" {
  zone_id = data.cloudflare_zone.zone.zone_id
  name    = local.tunnel_hostname
  ttl     = 1
  type    = "CNAME"
  proxied = true
  content = "${cloudflare_zero_trust_tunnel_cloudflared.tunnel.id}.cfargotunnel.com"
}
