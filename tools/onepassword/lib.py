import json
import os
import subprocess
from shlex import quote


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
        onepassword_service_account_token = os.environ.get(
            "ONEPASSWORD_SERVICE_ACCOUNT_TOKEN_PROD"
        )
    else:
        onepassword_vault_id = "vgijssel-dev"
        onepassword_service_account_token = os.environ.get(
            "ONEPASSWORD_SERVICE_ACCOUNT_TOKEN_DEV"
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

    # Set the service account only if the token is in the environment
    # this means we can use local 1Password directly!
    if onepassword_service_account_token:
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
        data[field["label"]] = field.get("value", None)

    return data[item_field]
