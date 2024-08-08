# Installation

1. Install xcode using `xcode-select --install`
1. Run bootstrap script in Terminal:

```bash
export BRANCH='master'; /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/mvgijssel/setup/$BRANCH/devenv/bootstrap.sh)"
```

## Manual steps after install

1. Setup 1Password
   1. Login
   1. Configure SSH agent
1. Login to iCloud
1. Setup Orbstack
1. Setup Alfred
   1. Map CMD + Space to Alfred
   1. Sync Alfred preferences to iCloud documents
1. Sync settings from Arc browser
1. Enable "Night Shift" in Displays > Night Shift
1. Map Caps Lock to Escape for "Apple Internal Keyboard / Trackpad" in Keyboard > Modified Keys
1. Set "Secondary click" to "Click in bottom right corner" in Trackpad
1. Reboot to ensure all changes have applied
