# Bootstrap

```bash
export BRANCH='feature/bootstrap-script'; /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/mvgijssel/setup/$BRANCH/dotfiles/bootstrap.sh)"
```

## TODOs

### General

- fix ruby racer install of v8:
```shell
gem install therubyracer -- --with-v8-dir=/usr/local/Cellar/v8@3.15/3.15.11.18_1
```

- need to run keyring import for nodejs 
```shell
bash ~/.asdf/plugins/nodejs/bin/import-release-team-keyring
```

- dnsmasq service
- redis service
- limit max files open
- osx tweaks (hide dock for example)

### Tests

- gpg
- npm global packages
- language versions
- ...

