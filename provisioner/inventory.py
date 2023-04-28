import os

setup_env = os.environ.get("SETUP_ENV", "dev")

if setup_env == "prod":
    hosts = [
        ("@ssh/192.168.1.31", {"ssh_user": "ubuntu"}),
    ]

elif setup_env == "test":
    container_id = os.environ["CONTAINER_ID"]
    hosts = [
        (f"@docker/{container_id}", {"inside_docker": True}),
    ]

else:
    container_id = "provisioner_dev"
    hosts = [
        (f"@docker/{container_id}", {"inside_docker": True}),
    ]
