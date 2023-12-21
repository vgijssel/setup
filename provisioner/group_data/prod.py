from pathlib import Path

setup_env = "prod"
inside_docker = False
legacy_ip_tables = False
teleport_public_addr = "tele.vgijssel.nl:443"
teleport_acme_email = "haves_borzoi_0o@icloud.com"
teleport_acme_enabled = "yes"
new_relic_display_name = "provisioner"
bunq2ynab_image_tag = (
    "ghcr.io/vgijssel/setup/bunq2ynab:"
    + Path("./tools/bunq2ynab/publish_oci_image.remote_tags.txt").read_text().strip()
)
