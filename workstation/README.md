# Installation

1. Create`.env.bootstrap` from 1Password
2. Run the bootstrap script

```
export BRANCH='master'; /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/mvgijssel/setup/$BRANCH/workstation/bootstrap.sh)"
```

# TODO terminal

- [x] migrate zshenv into fig
- [ ] migrate secrets into fig
- [ ] setup ssh using fig
- [ ] color scheme, snazzy again? Or something else?
- [ ] setup profile for iTerm2

# TODO programatically install:

- vscode extensions
- vscode configure python extension
- whatsapp
- viscosity
- notion
- docker desktop for mac
- spotify

# TODO manual steps after install

- launch and configure docker desktop
- launch and configure vscode

# TODO rest

- disable always updating homebrew when installing, upgrade/update on a schedule?
