from pyinfra.api import FactBase
from pyinfra import host
import json


class Item(FactBase):
    default = dict

    requires_command = "op"

    def command(
        self,
        item_title,
        onepassword_vault_id=None,
        onepassword_connect_host=None,
        onepassword_connect_token=None,
    ):
        if onepassword_vault_id is None:
            onepassword_vault_id = host.data.onepassword_vault_id

        if onepassword_connect_host is None:
            onepassword_connect_host = host.data.onepassword_connect_host

        if onepassword_connect_token is None:
            onepassword_connect_token = host.data.onepassword_connect_token

        return "OP_CONNECT_HOST='{onepassword_connect_host}' OP_CONNECT_TOKEN='{onepassword_connect_token}' op item get '{item_title}' --vault='{onepassword_vault_id}' --format=json".format(
            item_title=item_title,
            onepassword_vault_id=onepassword_vault_id,
            onepassword_connect_token=onepassword_connect_token,
            onepassword_connect_host=onepassword_connect_host,
        )

    def process(self, output):
        json_string = "\n".join(output)
        raw_data = json.loads(json_string)

        data = {}

        for field in raw_data["fields"]:
            data[field["id"]] = field.get("value", None)

        return data
