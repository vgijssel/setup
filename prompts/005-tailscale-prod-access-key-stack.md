<objective>
Create a Terraform stack at `apps/tailscale-prod` that provisions a Tailscale access key for the "peace-at-least" machine, intended for use by the `apps/pihole-prod` application. The key will be stored in the 1Password vault "setup-pihole-prod".
</objective>

<context>
This is a greenfield Terraform stack that needs:
- Tailscale provider to create an access key (auth key)
- 1Password provider to store the generated key in a vault
- S3 backend for state storage, following the pattern used by `apps/keycloak-prod`

Reference files for patterns:
@apps/keycloak-prod/backend.tf
@apps/keycloak-prod/backend.hcl.op.tpl
@apps/keycloak-prod/providers.tf
@apps/keycloak-prod/secrets.tfvars.op.tpl
@apps/keycloak-prod/main.tf
@apps/keycloak-prod/variables.tf
@apps/keycloak-prod/outputs.tf
@apps/keycloak-prod/moon.yml

1Password secrets structure:
- Vault "setup-tailscale-prod" contains:
  - "terraform-s3-bucket-credentials" - S3 backend credentials (bucket, accessKey, secretKey, endpoint)
  - "tailscale-oauth" - Tailscale OAuth credentials (clientId, clientSecret)
</context>

<research>
Before implementing, research and understand:
1. The structure and patterns used in `apps/keycloak-prod` for backend configuration, provider setup, and 1Password integration
2. The Tailscale Terraform provider's `tailscale_tailnet_key` resource for creating auth keys
3. The 1Password provider's resources for creating items in vaults
</research>

<requirements>
1. Create directory structure at `apps/tailscale-prod/` with these files:
   - `backend.tf` - S3 backend configuration with key "tailscale-prod"
   - `backend.hcl.op.tpl` - 1Password template for S3 credentials from vault "setup-tailscale-prod", item "terraform-s3-bucket-credentials"
   - `providers.tf` - Terraform version constraints and provider configurations
   - `main.tf` - Resource definitions
   - `variables.tf` - Input variables
   - `outputs.tf` - Output values
   - `moon.yml` - Moon task configuration following existing patterns

2. Tailscale Provider Authentication:
   The Tailscale provider supports three authentication methods (choose ONE):

   **Option A - OAuth Client (Recommended by Tailscale):**
   - Environment variables: `TAILSCALE_OAUTH_CLIENT_ID` and `TAILSCALE_OAUTH_CLIENT_SECRET`
   - Benefits: Not tied to individual user, does not expire, supports scopes
   - Provider block: `provider "tailscale" { oauth_client_id = "..." oauth_client_secret = "..." tailnet = "-" }`

   **Option B - API Key:**
   - Environment variable: `TAILSCALE_API_KEY`
   - Provider block: `provider "tailscale" { api_key = "..." tailnet = "-" }`

   **Option C - Identity Token (for federated identity):**
   - Environment variable: `TAILSCALE_IDENTITY_TOKEN`
   - Used for exchanging JWT for Tailscale API token

   Use the tailnet value "-" to reference the default tailnet of the credentials.

   **Implementation:** Use OAuth client credentials from 1Password vault "setup-tailscale-prod", item "tailscale-oauth" which contains `clientId` and `clientSecret` fields. Create a `secrets.tfvars.op.tpl` template file following the keycloak-prod pattern:
   ```
   tailscale_oauth_client_id     = "{{ op://setup-tailscale-prod/tailscale-oauth/clientId }}"
   tailscale_oauth_client_secret = "{{ op://setup-tailscale-prod/tailscale-oauth/clientSecret }}"
   ```

3. 1Password Provider:
   - Uses environment variable `OP_SERVICE_ACCOUNT_TOKEN` for authentication
   - Provider block can be empty: `provider "onepassword" {}`

4. Tailscale Auth Key Resource:
   - Use `tailscale_tailnet_key` resource to create an auth key
   - Set appropriate tags to identify this key is for "peace-at-least" machine
   - Consider setting `reusable = false` for security
   - Consider `ephemeral = true` if the device should be removed when offline
   - Consider `preauthorized = true` to skip manual authorization

5. 1Password Item Storage:
   - Create a `onepassword_item` resource in vault "setup-pihole-prod"
   - Store the generated Tailscale auth key
   - Name the item appropriately (e.g., "tailscale-auth-key-peace-at-least")
</requirements>

<implementation>
Follow these steps in order:

1. Read and understand the keycloak-prod stack structure thoroughly
2. Create `apps/tailscale-prod/` directory
3. Create `backend.tf` mirroring keycloak-prod but with key "tailscale-prod"
4. Create `backend.hcl.op.tpl` referencing "setup-tailscale-prod" vault for S3 credentials
5. Create `providers.tf` with:
   - terraform required_version >= 1.0
   - tailscale provider (latest stable version from registry)
   - onepassword provider version 2.1.2 (matching keycloak-prod)
6. Create `secrets.tfvars.op.tpl` for Tailscale OAuth credentials from 1Password
7. Create `variables.tf` with necessary input variables
8. Create `main.tf` with:
   - Data source to read the target 1Password vault "setup-pihole-prod"
   - `tailscale_tailnet_key` resource for the auth key
   - `onepassword_item` resource to store the key in the pihole vault
9. Create `outputs.tf` with relevant outputs (avoid outputting sensitive key values directly)
10. Create `moon.yml` following the pattern from keycloak-prod

Pin all provider versions explicitly (e.g., `version = "X.Y.Z"` not `version = "~> X.Y"`).
</implementation>

<constraints>
- DO NOT store sensitive credentials in source control - use 1Password templates
- Pin all provider versions to exact versions for reproducibility
- Follow the existing patterns from keycloak-prod exactly for consistency
- Use relative paths for all file outputs
- The 1Password vault "setup-tailscale-prod" contains "terraform-s3-bucket-credentials" for backend auth
- The 1Password vault "setup-pihole-prod" is where the Tailscale key should be stored
</constraints>

<output>
Create/modify these files:
- `./apps/tailscale-prod/backend.tf`
- `./apps/tailscale-prod/backend.hcl.op.tpl`
- `./apps/tailscale-prod/providers.tf`
- `./apps/tailscale-prod/secrets.tfvars.op.tpl`
- `./apps/tailscale-prod/variables.tf`
- `./apps/tailscale-prod/main.tf`
- `./apps/tailscale-prod/outputs.tf`
- `./apps/tailscale-prod/moon.yml`
</output>

<verification>
Before declaring complete, verify:
1. All files are created in `apps/tailscale-prod/`
2. `terraform fmt -check` passes on all .tf files
3. `terraform validate` would pass (syntax check - may fail without actual credentials)
4. The backend.hcl.op.tpl references the correct vault "setup-tailscale-prod"
5. The 1Password item is being created in vault "setup-pihole-prod"
6. All provider versions are pinned to exact versions
7. The moon.yml follows project conventions
</verification>

<success_criteria>
- Complete Terraform stack at apps/tailscale-prod/
- S3 backend configured matching keycloak-prod pattern
- Tailscale provider configured with OAuth client authentication via 1Password templates
- 1Password provider configured for storing the auth key
- tailscale_tailnet_key resource creates an auth key tagged for "peace-at-least"
- onepassword_item resource stores the key in "setup-pihole-prod" vault
- All files follow existing project patterns and conventions
</success_criteria>
