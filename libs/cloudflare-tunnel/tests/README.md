# OpenTofu Tests

This directory contains OpenTofu test files for the cloudflare-tunnel module.

## Running Tests

Tests require valid Cloudflare API credentials to execute successfully. To run tests:

1. Set environment variables:
   ```bash
   export TF_VAR_cloudflare_api_token="your-cloudflare-api-token"
   export TF_VAR_cloudflare_account_id="your-cloudflare-account-id"
   export TF_VAR_tunnel_name="test-tunnel"
   export TF_VAR_tunnel_service="http://localhost:8080"
   export TF_VAR_zone_name="your-domain.com"
   ```

2. Run the tests:
   ```bash
   nx run cloudflare-tunnel:test
   ```

## Test Status

Currently, no automated tests are configured because they require valid API credentials which cannot be safely provided in CI environments. The module is validated through:

- `tofu validate` - Syntax and configuration validation
- `tofu fmt` - Code formatting checks
- Manual testing with real credentials

## Future Improvements

Consider implementing tests using one of these approaches:
- Mock provider responses (when OpenTofu supports it)
- Integration tests in a separate environment with test credentials
- Terraform/OpenTofu plan validation without API calls
