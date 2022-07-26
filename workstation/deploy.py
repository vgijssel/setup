# from pyinfra.operations import brew
from workstation.deploys.terminal.tasks.install_terminal import install_terminal
from workstation.deploys.editor.tasks.install_editor import install_editor

# TODO:
#
# Try to keep the brew packages as close to the actual "feature" that's using it.
# so for example all the gnu tools should probably be installed together with zsh!
#
# install asdf
# - asdf binary using homebrew
# - asdf shell snippet in zsh
# - some plugins used by the setup repo?
#
# install ssh
# - gpg
# - download secrets from 1password
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

install_terminal()
install_editor()

# brew.packages(
#     name="Install vim",
#     packages=["vim"],
#     present=True,
#     update=False,
#     latest=False,
#     upgrade=False,
# )
