# Cloudflare Tunnel Terraform Variables
# This template is used with 1Password CLI to inject secrets
# Run: op inject --force -i terraform.tfvars.tpl -o terraform.tfvars

# Cloudflare API Token (sensitive)
cloudflare_api_token = "op://setup-devenv/cloudflare-tunnel/credential"

# Cloudflare Account ID (sensitive)
cloudflare_account_id = "op://setup-devenv/cloudflare-tunnel/username"

# Tunnel Name
tunnel_name = "my-test-tunnel"

# Tunnel Service URL
tunnel_service = "http://localhost:3000"

# Cloudflare Zone Name
zone_name = "vgijssel-dev.nl"
