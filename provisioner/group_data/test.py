setup_env = "test"
inside_docker = True
legacy_ip_tables = True
teleport_public_addr = "127.0.0.1:10443"
teleport_acme_email = ""
teleport_acme_enabled = "no"
new_relic_display_name = "provisioner_test"
bunq2ynab_image_tag = (
    "ghcr.io/vgijssel/setup/bunq2ynab-dev:"
    + open("./tools/bunq2ynab/publish_oci_image-dev.remote_tags.txt", "r")
    .read()
    .strip()
)
