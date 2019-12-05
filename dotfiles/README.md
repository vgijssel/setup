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


### mediacenter

https://github.com/viralpoetry/packer-bare-metal

- setup no subscription sources proxmox (https://pve.proxmox.com/wiki/Package_Repositories)
- OpenStack, FOG, FAI, foreman, cobbler, razor, MAAS for PXE based unattended installation
- all-in-one PXE boot which works with existing DHCP
  https://github.com/danderson/netboot/tree/master/pixiecore
- V2P (virtual 2 physical)
- cloud-init
- Immutable infrastructure bare metal
- https://github.com/hashicorp/packer/issues/955
- https://github.com/inovex/fluffy-unicorn
- IPMI BMC
- debootstrap debian/ubuntu
- diskimage-builder OpenStack (https://docs.openstack.org/diskimage-builder/latest/)
- Upload the Vagrant.box file to GitHub releases?
    - Upload the vagrant box to Vagrant cloud
- Install libnss-mdns into VMs to have local bonjour lookup of VMs

### General

- use regular homebrew https://docs.ansible.com/ansible/latest/modules/homebrew_module.html instead of ansible galaxy role
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

### Sofware

- postgres.app
- viscosity.app
- spectacle.app
- resiliosync
- spacemacs

### Tests

- gpg
- npm global packages
- language versions
- ...

