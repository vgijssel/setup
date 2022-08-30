# Installation

1. Install xcode from the appstore (can we do this automatically using mas cli?)
2. Install 1Password 8 from here .... Ensure to enable biometric unlock for the CLI
3. Run the bootstrap script

```
export BRANCH='master'; /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/mvgijssel/setup/$BRANCH/workstation/bootstrap.sh)"
```

# TODO programatically install:

- xcode
```
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license

# create symlink to SDK?
MacOSX12.3.sdk -> /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk
```
- vscode extensions
- vscode configure python extension

# TODO manual steps after install

- launch and configure docker desktop
- launch and configure vscode
- launch and configure iTerm2 

# TODO rest

- disable always updating homebrew when installing, upgrade/update on a schedule?