TF_VAR_keycloak_admin_password={{ op://sso-prod/keycloak-admin/password }}
AWS_ACCESS_KEY_ID={{ op://sso-prod/terraform-s3-bucket-credentials/AWS_ACCESS_KEY_ID }}
AWS_SECRET_ACCESS_KEY={{ op://sso-prod/terraform-s3-bucket-credentials/AWS_SECRET_ACCESS_KEY }}
AWS_ENDPOINT_URL_S3={{ op://sso-prod/terraform-s3-bucket-credentials/AWS_ENDPOINT_URL_S3 }}
TF_VAR_s3_bucket={{ op://sso-prod/terraform-s3-bucket-credentials/TF_VAR_s3_bucket }}
OP_SERVICE_ACCOUNT_TOKEN={{ op://sso-prod/op-service-account/credential }}
