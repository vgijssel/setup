import os

from pyinfra import host
from pyinfra.facts.server import Home
from pyinfra.operations import files


def symlink(source_file, target_file, **kwargs):
    source_file_absolute = os.path.abspath(source_file)

    if not os.path.isfile(source_file_absolute):
        raise Exception(f"Source file does not exist: {source_file_absolute}.")

    files.link(
        name=f"Link {source_file_absolute} to {target_file}",
        path=target_file,
        target=source_file_absolute,
        present=True,
        symbolic=True,
        force=True,
        create_remote_dir=True,
        **kwargs,
    )


def home_link(source_file, target_file):
    home_dir = host.get_fact(Home)
    target_file = os.path.join(home_dir, target_file)

    symlink(
        source_file=source_file,
        target_file=target_file,
        force_backup=True,
        force_backup_dir=home_dir,
    )
