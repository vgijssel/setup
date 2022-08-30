import os
from rules_python.python.runfiles import runfiles
from pyinfra.facts.server import Home
from pyinfra import host
from pyinfra.operations import files

r = runfiles.Create()


def home_link(source_file, target_file):
    source_file_absolute = r.Rlocation(source_file)

    if source_file_absolute is None:
        raise Exception(f"Could not find: {source_file}. Check data files!")

    if not os.path.isfile(source_file_absolute):
        raise Exception(
            f"File does not exist: {source_file_absolute}. Check data files!"
        )

    home_dir = host.get_fact(Home)
    target_file = os.path.join(home_dir, target_file)

    files.link(
        name=f"Link {source_file_absolute} to {target_file}",
        path=target_file,
        target=source_file_absolute,
        present=True,
        symbolic=True,
        force=True,
        create_remote_dir=True,
        force_backup=True,
        force_backup_dir=home_dir,
    )
