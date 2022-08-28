# Installation

1. Create`.env.bootstrap` from 1Password
2. Run the bootstrap script

```
export BRANCH='master'; /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/mvgijssel/setup/$BRANCH/workstation/bootstrap.sh)"
```

# TODO terminal

- [x] migrate zshenv into fig
- [x] color scheme, try a different theme "Tomorrow"
- [x] color scheme for VSCode!
- [x] migrate secrets into fig
- [x] setup SSH with GPG 
- [ ] rewrite last setup repo commits to use proper git committer email
- [ ] automatically export iTerm2 preferences to folder
- [ ] color schema for Fig

# TODO programatically install:

- 1password beta (for git commit signing)
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
- launch and configure iTerm2 

# TODO rest

- disable always updating homebrew when installing, upgrade/update on a schedule?
