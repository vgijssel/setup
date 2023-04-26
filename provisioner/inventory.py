import os

if os.environ.get("SETUP_ENV", "dev") == "prod":
    hosts = [
        ("@ssh/192.168.1.31", {"ssh_user": "ubuntu"}),
    ]
else:
    container_id = "provisioner_dev"
    hosts = [
        (f"@docker/{container_id}", {"inside_docker": True}),
    ]
