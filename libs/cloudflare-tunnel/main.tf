      terraform {
        required_providers {
          cloudflare = {
            source = "cloudflare/cloudflare"
            version = "5.9.0"
          }
        }
      }

      variable "cloudflare_api_token" {
        description = "Cloudflare API token"
        type        = string
        sensitive   = true
      }

      variable "cloudflare_account_id" {
        description = "Cloudflare account ID"
        type        = string
      }

      variable "tunnel_name" {
        description = "Cloudflare tunnel name"
        type        = string
        default = "testing"
      }

      variable "tunnel_hostname" {
        description = "Hostname for the tunnel"
        type        = string
        default = "testing.vgijssel-dev.nl"
      }

      variable "tunnel_service" {
        description = "Service URL for the tunnel"
        type        = string
        default = "http://example-nginx:80"
      }

      variable "zone_name" {
        description = "Cloudflare zone name"
        type        = string
        default     = "vgijssel-dev.nl"
      }

      provider "cloudflare" {
        api_token = var.cloudflare_api_token
      }

      resource "cloudflare_zero_trust_tunnel_cloudflared" "example" {
        account_id = var.cloudflare_account_id
        name       = var.tunnel_name
      }

      resource "cloudflare_zero_trust_tunnel_cloudflared_config" "example" {
        account_id = var.cloudflare_account_id
        tunnel_id  = cloudflare_zero_trust_tunnel_cloudflared.example.id

        config = {
          ingress = [
            {
              hostname = var.tunnel_hostname
              service  = var.tunnel_service
            },
            {
              service = "http_status:404"
            }
          ]
        }
      }

      data "cloudflare_zero_trust_tunnel_cloudflared_token" "example" {
        account_id = var.cloudflare_account_id
        tunnel_id  = cloudflare_zero_trust_tunnel_cloudflared.example.id
      }

      resource "cloudflare_dns_record" "tunnel_cname" {
        zone_id = data.cloudflare_zone.vgijssel_dev.zone_id
        name    = "testing.vgijssel-dev.nl"
        ttl     = 1
        type    = "CNAME"
        proxied = true
        content = "${cloudflare_zero_trust_tunnel_cloudflared.example.id}.cfargotunnel.com"
      }

      data "cloudflare_zones" "available" {
      }

      data "cloudflare_zone" "vgijssel_dev" {
        filter = {
          name = "vgijssel-dev.nl"
        }
      }

      output "available_zones" {
        value = data.cloudflare_zones.available.result
      }

      output "tunnel_id" {
        value = cloudflare_zero_trust_tunnel_cloudflared.example.id
      }

      output "tunnel_token" {
        value     = data.cloudflare_zero_trust_tunnel_cloudflared_token.example.token
        sensitive = true
      }