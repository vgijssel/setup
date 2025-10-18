# Basic validation tests for cloudflare-tunnel module
# Note: These tests require valid Cloudflare API credentials to fully pass
# Without credentials, they validate configuration syntax and structure

variables {
  cloudflare_api_token  = "mocktokn1234567890abcdefghijklmnopqrst"
  cloudflare_account_id = "mockacct1234567890abcdefghijklmnopqrst"
  tunnel_name           = "test-tunnel"
  tunnel_service        = "http://localhost:8080"
  zone_name             = "example.com"
}

# Test configuration structure - will fail during plan without valid credentials
# but validates that the configuration is syntactically correct
run "validate_configuration" {
  command = plan

  # This test validates the configuration structure
  # It will fail during planning due to invalid API credentials,
  # but the failure occurs after successful configuration validation
}
