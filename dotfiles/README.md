# Bootstrap

Copy things from https://github.com/elnappo/dotfiles/blob/master/init/setup.sh

```shell
# To prevent xcode from complaining later
xcode-select --install

# install brew
# install packages through brew
brew install ansible 
brew cask install 1password-cli

# Install ansible dependencies
ansible-galaxy install -r requirements.yml

# Run the playbook
ansible-playbook main.yml -i inventory -K
```

## TODOs

### General

- use regular homebrew https://docs.ansible.com/ansible/latest/modules/homebrew_module.html instead of ansible galaxy role
- fix ruby racer install of v8 (https://stackoverflow.com/a/59315388)
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

### Sofware

- postgres.app
- viscosity.app
- spectacle.app
- resiliosync
- spacemacs
- Logitech G502 software
- vagrant-libvirt (https://lunar.computer/posts/vagrant-libvirt-macos/)

### Tests

- gpg
- npm global packages
- language versions
- ...

