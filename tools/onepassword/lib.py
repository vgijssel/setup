import os
import json
import subprocess
from shlex import quote
from pathlib import Path


def _get_onepassword_service_account_token(env_key, tmp_file):
    if env_key in os.environ:
        return os.environ[env_key]

    file = os.path.join(
        os.environ.get("BUILD_WORKSPACE_DIRECTORY", ""),
        "tmp",
        tmp_file,
    )

    if os.path.exists(file):
        return Path(file).read_text()

    else:
        raise ValueError(f"Either set env variable '{env_key}' or create file '{file}'")


def get_item_path(path):
    parts = path.split(".")

    if len(parts) == 2:
        item_title = parts[0]
        item_field = parts[1]
    else:
        raise Exception(
            "Invalid path: {} with parts {}. Expected 2 parts".format(path, parts)
        )

    if os.environ.get("SETUP_ENV") == "prod":
        onepassword_vault_id = "vgijssel-prod"
        onepassword_service_account_token = _get_onepassword_service_account_token(
            "ONEPASSWORD_SERVICE_ACCOUNT_TOKEN_PROD",
            "1password-service-account-token-prod",
        )
    else:
        onepassword_vault_id = "vgijssel-dev"
        onepassword_service_account_token = _get_onepassword_service_account_token(
            "ONEPASSWORD_SERVICE_ACCOUNT_TOKEN_DEV",
            "1password-service-account-token-dev",
        )

    op_binary = os.environ["OP_BINARY"]

    command = [
        op_binary,
        "item",
        "get",
        quote(item_title),
        "--vault={}".format(quote(onepassword_vault_id)),
        "--format=json",
    ]

    op_env = os.environ.copy()
    op_env["OP_SERVICE_ACCOUNT_TOKEN"] = onepassword_service_account_token

    result = subprocess.run(command, env=op_env, capture_output=True)

    if result.returncode != 0:
        raise Exception(
            "Failed to get item: '{}' with error '{}'".format(
                item_title, result.stderr.decode("utf-8")
            )
        )

    json_string = result.stdout.decode("utf-8")
    raw_data = json.loads(json_string)

    data = {}

    for field in raw_data["fields"]:
        data[field["id"]] = field.get("value", None)

    return data[item_field]
