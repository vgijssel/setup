from pyinfra.api.deploy import deploy
from pyinfra.api import operation
from pyinfra.operations import brew
from pyinfra.facts.server import Command
from workstation.helpers.home_link import home_link
from pyinfra import host

from rules_python.python.runfiles import runfiles

r = runfiles.Create()

tool_versions_file = "setup/workstation/deploys/languages/files/tool-versions"
tool_versions_path = r.Rlocation(
    "setup/workstation/deploys/languages/files/tool-versions"
)


@operation
def asdf_plugin(plugin_name):
    # installed_asdf_plugins = set(host.get_fact(Command, "asdf plugin list").split("\n"))

    # if plugin_name in installed_asdf_plugins:
    #    return []

    yield f"asdf plugin-add {plugin_name}"


@deploy("Install Languages")
def install_languages():
    brew.packages(
        name="Install asdf",
        packages=[
            "asdf",
        ],
        present=True,
        update=False,
        latest=False,
        upgrade=False,
    )

    home_link(
        source_file=tool_versions_file,
        target_file=f".tool-versions",
    )

    # From https://github.com/asdf-vm/asdf/issues/276#issuecomment-1189478229
    wanted_asdf_plugins = set(
        host.get_fact(
            Command, f"cut -d' ' -f1 {tool_versions_path}|xargs -I{{}} echo {{}}"
        ).split("\n")
    )

    for asdf_plugin_name in wanted_asdf_plugins:
        asdf_plugin(
            name=f"Install asdf plugin: {asdf_plugin_name}",
            plugin_name=asdf_plugin_name,
        )
