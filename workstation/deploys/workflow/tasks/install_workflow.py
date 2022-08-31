from pyinfra.operations import brew, server
from pyinfra.api.deploy import deploy
from workstation.helpers import macos


@deploy("Install Workflow")
def install_workflow():
    brew.casks(
        name="Install Worflow Apps",
        casks=[
            "alfred",
            "amethyst",
        ],
        present=True,
        latest=False,
        upgrade=False,
    )

    macos.default(
        name='Disable "Correct spelling automatically"',
        domain="NSGlobalDomain",
        setting="NSAutomaticSpellingCorrectionEnabled",
        value=int(0),
    )

    macos.default(
        name='Disable "Capitalize words automatically"',
        domain="NSGlobalDomain",
        setting="NSAutomaticCapitalizationEnabled",
        value=int(0),
    )

    macos.default(
        name='Disable "Add period with double-space"',
        domain="NSGlobalDomain",
        setting="NSAutomaticPeriodSubstitutionEnabled",
        value=int(0),
    )

    macos.default(
        name='Set "Key Repeat" to be really fast. "2" is the lowest from the Macos UI',
        domain="NSGlobalDomain",
        setting="KeyRepeat",
        value=int(1),
    )

    macos.default(
        name='Set "Delay Until Repeat" to be faster',
        domain="NSGlobalDomain",
        setting="InitialKeyRepeat",
        value=int(12),
    )

    # https://apple.stackexchange.com/a/298826
    macos.default(
        name='Enable "Automatically hide and show the Docker"',
        domain="com.apple.dock",
        setting="autohide",
        value=True,
    )

    macos.default(
        name='Set a 1000 second delay before the dock appears',
        domain="com.apple.dock",
        setting="autohide-delay",
        value=float(1000),
    )

    macos.default(
        name='Disable "Automatically rearrange Spaces based on most recent use" in Mission Control',
        domain="com.apple.dock",
        setting="mru-spaces",
        value=False,
    )

    server.shell(
        name="Restart macOS Dock",
        commands=["killall Dock"],
    )

    server.shell(
        name="Restart macOS Finder",
        commands=["killall Finder"],
    )