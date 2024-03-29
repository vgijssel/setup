from workstation.deploys.terminal.tasks.install_terminal import install_terminal
from workstation.deploys.editor.tasks.install_editor import install_editor
from workstation.deploys.languages.tasks.install_languages import install_languages
from workstation.deploys.ssh.tasks.install_ssh import install_ssh
from workstation.deploys.utilities.tasks.install_utilities import install_utilities
from workstation.deploys.workflow.tasks.install_workflow import install_workflow
from pyinfra import host

if host.data.get("install_terminal"):
    install_terminal()

if host.data.get("install_editor"):
    install_editor()

if host.data.get("install_languages"):
    install_languages()

if host.data.get("install_ssh"):
    install_ssh()

if host.data.get("install_workflow"):
    install_workflow()

if host.data.get("install_utilities"):
    install_utilities()
