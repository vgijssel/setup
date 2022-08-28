import os
from pyinfra.api.deploy import deploy
from workstation.helpers.home_link import home_link
from onepasswordconnectsdk.client import new_client, new_client
from pyinfra.operations import brew

onepassword_client = new_client(
    os.environ["ONEPASSWORD_CONNECT_HOST"],
    os.environ["ONEPASSWORD_CONNECT_TOKEN"],
)
onepassword_vault_id = os.environ["ONEPASSWORD_CONNECT_VAULT_ID"]

@deploy("Install SSH")
def install_ssh():
    brew.packages(
        name="Install latest version of git",
        packages=[
            "git",
        ],
        present=True,
        update=False,
        latest=True,
        upgrade=False,
    )

    ssh_config_files = [
        "ssh/config",
        "gitconfig",
    ]

    for file in ssh_config_files:
        home_link(
            source_file=f"setup/workstation/deploys/ssh/files/{file}",
            target_file=f".{file}",
        )

    ssh_secret_config_files = ["~/.ssh/user_config"]

    for file in ssh_secret_config_files:
        document = onepassword_client.get_item_by_title(file, onepassword_vault_id)
        document_files = onepassword_client.get_files(document.id, onepassword_vault_id)

        local_file = os.path.expanduser(file)
        local_dir = os.path.dirname(local_file)

        for document_file in document_files:
            print(
                f"Downloading {document_file.name} to {local_dir} resulting in {local_file}"
            )

            onepassword_client.download_file(
                document_file.id,
                document.id,
                onepassword_vault_id,
                local_dir,
            )
