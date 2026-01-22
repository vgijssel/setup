locals {
  # Machine identification
  machine_name = "peace-at-least"
}

# 1Password vault for storing Tailscale auth key
data "onepassword_vault" "pihole_prod" {
  name = "setup-pihole-prod"

  lifecycle {
    postcondition {
      condition     = can(self.uuid)
      error_message = "The 'setup-pihole-prod' vault must exist in 1Password."
    }
  }
}

# Tailscale auth key for the peace-at-least machine
resource "tailscale_tailnet_key" "peace_at_least" {
  reusable      = false
  ephemeral     = false
  preauthorized = true
  description   = "Auth key for peace-at-least pihole-prod"
  tags          = ["tag:pihole-prod"]
}

# Write Tailscale auth key to 1Password for pihole-prod to consume
resource "onepassword_item" "tailscale_auth_key" {
  vault    = data.onepassword_vault.pihole_prod.uuid
  title    = "tailscale-auth-key"
  category = "login"

  section {
    label = "Tailscale Auth Key"

    field {
      label = "authKey"
      type  = "CONCEALED"
      value = tailscale_tailnet_key.peace_at_least.key
    }

    field {
      label = "machine"
      type  = "STRING"
      value = local.machine_name
    }

    field {
      label = "expiresAt"
      type  = "STRING"
      value = tailscale_tailnet_key.peace_at_least.expires_at
    }
  }
}
