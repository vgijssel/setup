terraform {
  backend "s3" {
    key = "sso-prod"

    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    use_path_style              = true
    use_lockfile                = true
    region                      = "us-east-1"
  }
}
