# Note: These tests will show warnings about cloudflare_zero_trust_tunnel_cloudflared_config
# not being destroyable via Terraform. This is expected behavior from the Cloudflare provider
# and does not indicate a test failure. The resource must be manually deleted from the
# Cloudflare dashboard when needed.

run "test_random_id_configuration" {
  command = plan

  assert {
    condition     = random_id.tunnel_suffix.byte_length == 4
    error_message = "Random suffix should be 4 bytes"
  }

  assert {
    condition     = random_id.tunnel_suffix.prefix == "${var.tunnel_name}-"
    error_message = "Random ID prefix should match tunnel_name with hyphen"
  }
}


run "test_tunnel_hostname_format" {
  command = plan

  assert {
    condition     = local.tunnel_hostname == "${var.tunnel_name}.${var.zone_name}"
    error_message = "Tunnel hostname should be '<tunnel_name>.<zone_name>'"
  }
}

run "test_tunnel_account_id" {
  command = plan

  assert {
    condition     = cloudflare_zero_trust_tunnel_cloudflared.tunnel.account_id == var.cloudflare_account_id
    error_message = "Tunnel account_id should match the provided account_id"
  }
}

run "test_tunnel_config_references" {
  command = plan

  assert {
    condition     = cloudflare_zero_trust_tunnel_cloudflared_config.tunnel_config.account_id == var.cloudflare_account_id
    error_message = "Tunnel config account_id should match the provided account_id"
  }

  assert {
    condition     = length(cloudflare_zero_trust_tunnel_cloudflared_config.tunnel_config.config.ingress) == 2
    error_message = "Tunnel config should have 2 ingress rules (service + catch-all)"
  }

  assert {
    condition     = cloudflare_zero_trust_tunnel_cloudflared_config.tunnel_config.config.ingress[0].service == var.tunnel_service
    error_message = "First ingress rule should use the configured tunnel_service"
  }

  assert {
    condition     = cloudflare_zero_trust_tunnel_cloudflared_config.tunnel_config.config.ingress[1].service == "http_status:404"
    error_message = "Second ingress rule should be catch-all 404"
  }
}

run "test_dns_record_configuration" {
  command = plan

  assert {
    condition     = cloudflare_dns_record.tunnel_cname.type == "CNAME"
    error_message = "DNS record should be a CNAME"
  }

  assert {
    condition     = cloudflare_dns_record.tunnel_cname.proxied == true
    error_message = "DNS record should be proxied"
  }

  assert {
    condition     = cloudflare_dns_record.tunnel_cname.ttl == 1
    error_message = "DNS record TTL should be 1 (automatic)"
  }
}

run "test_apply_and_verify" {
  command = apply

  assert {
    condition     = cloudflare_zero_trust_tunnel_cloudflared.tunnel.id != ""
    error_message = "Tunnel ID should be generated after creation"
  }

  assert {
    condition     = can(regex("^${var.tunnel_name}-[a-f0-9]{8}$", cloudflare_zero_trust_tunnel_cloudflared.tunnel.name))
    error_message = "Tunnel name should have format '<prefix>-<hex>' but got '${cloudflare_zero_trust_tunnel_cloudflared.tunnel.name}'"
  }

  assert {
    condition     = cloudflare_zero_trust_tunnel_cloudflared.tunnel.account_id == var.cloudflare_account_id
    error_message = "Tunnel should be created in the correct account"
  }

  assert {
    condition     = data.cloudflare_zero_trust_tunnel_cloudflared_token.tunnel_token.token != ""
    error_message = "Tunnel token should be generated"
  }

  assert {
    condition     = cloudflare_dns_record.tunnel_cname.id != ""
    error_message = "DNS record should be created"
  }

  assert {
    condition     = can(regex("\\.cfargotunnel\\.com$", cloudflare_dns_record.tunnel_cname.content))
    error_message = "DNS record should point to cfargotunnel.com domain"
  }

  assert {
    condition     = cloudflare_dns_record.tunnel_cname.name == local.tunnel_hostname
    error_message = "DNS record name should match tunnel hostname"
  }
}
