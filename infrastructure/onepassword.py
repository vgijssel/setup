from onepasswordconnectsdk.client import Client, new_client
import pulumi

config = pulumi.Config()

onepassword_connect_host = config.require("onepassword_connect_host")
onepassword_connect_token = config.require("onepassword_connect_token")
onepassword_connect_vault_id = config.require("onepassword_connect_vault_id")

onepassword_client: Client = new_client(
    onepassword_connect_host,
    onepassword_connect_token,
)


def get_secret(name: str):
    summary = onepassword_client.get_item_by_title(name, onepassword_connect_vault_id)
    item = onepassword_client.get_item(summary.id, onepassword_connect_vault_id)
    values = {}
    for field in item.fields:
        values[field.id] = field.value
    return values
