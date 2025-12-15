HCLOUD_TOKEN={{ op://setup-gateway/hetzner-cloud/credential }}
AWS_ACCESS_KEY_ID={{ op://setup-gateway/terraform-s3-bucket-credentials/accessKey }}
AWS_SECRET_ACCESS_KEY={{ op://setup-gateway/terraform-s3-bucket-credentials/secretKey }}
AWS_ENDPOINT_URL_S3={{ op://setup-gateway/terraform-s3-bucket-credentials/endpoint }}
TF_VAR_s3_bucket={{ op://setup-gateway/terraform-s3-bucket-credentials/bucket }}
