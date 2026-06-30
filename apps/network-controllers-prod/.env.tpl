# Rendered to .env via `op inject -i .env.tpl -o .env` (moon run :secrets).
# All secrets live in the 1Password vault `enigma-prod`.

# --- Hetzner Cloud ---
HCLOUD_TOKEN={{ op://enigma-prod/hetzner-cloud/credential }}

# --- OpenTofu S3 backend (Hetzner Object Storage, nbg1) ---
AWS_ACCESS_KEY_ID={{ op://enigma-prod/hetzner-cloud-s3/access_key }}
AWS_SECRET_ACCESS_KEY={{ op://enigma-prod/hetzner-cloud-s3/secret_key }}
AWS_ENDPOINT_URL_S3={{ op://enigma-prod/hetzner-cloud-s3/endpoint }}
TF_VAR_s3_bucket={{ op://enigma-prod/hetzner-cloud-s3/bucket }}

# --- Cloudflare (zone: vgijssel.nl; Zone:Read + DNS:Edit) ---
# Used by the cloudflare OpenTofu provider (CLOUDFLARE_API_TOKEN) and templated into
# the Caddy config for Let's Encrypt DNS-01 on the private admin hostnames.
CLOUDFLARE_API_TOKEN={{ op://enigma-prod/cloudflare/credential }}
TF_VAR_cloudflare_api_token={{ op://enigma-prod/cloudflare/credential }}
TF_VAR_cloudflare_account_id={{ op://enigma-prod/cloudflare/account_id }}

# --- Tailscale (pre-existing per-node auth key) ---
TF_VAR_tailscale_authkey={{ op://enigma-prod/tailscale/credential }}

# --- Netdata Cloud claim ---
TF_VAR_netdata_claim_url={{ op://enigma-prod/netdata/claim_url }}
TF_VAR_netdata_claim_token={{ op://enigma-prod/netdata/claim_token }}
TF_VAR_netdata_claim_rooms={{ op://enigma-prod/netdata/room_ids }}
