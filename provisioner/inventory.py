import os

setup_env = os.environ.get("SETUP_ENV", "dev")

if setup_env == "prod":
    prod = [
        ("@ssh/provisioner.local"),
    ]

elif setup_env == "test":
    container_id = os.environ["CONTAINER_ID"]
    test = [
        (f"@docker/{container_id}"),
    ]

else:
    container_id = "provisioner_dev"
    dev = [
        (f"@docker/{container_id}"),
    ]
