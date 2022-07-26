# from pyinfra.operations import brew
from workstation.deploys.terminal.tasks.install_terminal import install_terminal
from workstation.deploys.editor.tasks.install_editor import install_editor
from workstation.deploys.languages.tasks.install_languages import install_languages
from workstation.deploys.ssh.tasks.install_ssh import install_ssh
from pyinfra import host

# TODO:
#
# Try to keep the brew packages as close to the actual "feature" that's using it.
# so for example all the gnu tools should probably be installed together with zsh!
#
# setup macos customisations
# - max files
# - other random settings
#
# create github action test for bootstrapping
# cleanup dotfiles
# alternative for dns-heaven? no m1 support?
# delete rcm
# delete mrconfig
# delete dotfiles dir
# delete github test job
# delete direnv

if host.data.get("install_terminal"):
    install_terminal()

if host.data.get("install_editor"):
    install_editor()

if host.data.get("install_languages"):
    install_languages()

if host.data.get("install_ssh"):
    install_ssh()
