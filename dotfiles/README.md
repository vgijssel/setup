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

- setup no subscription sources proxmox (https://pve.proxmox.com/wiki/Package_Repositories)
- OpenStack, FAI, foreman, cobbler, razor, MAAS for PXE based unattended installation
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

### Image builder machine

- squashfs-tools
- curl
- sudo
- python-pip
- qemu-utils
- kpartx
- build-essential
- module-assistant
- debootstrap
- libguestfs-tools # to navigate the created image
- git

- simple-init # used to initialize basic networking
- devuser # creates a user to use for login

- module-assistant prepare --non-inter
- pip install disk-image-create
- DIB_DEV_USER_USERNAME=vagrant DIB_DEV_USER_PWDLESS_SUDO=yes DIB_DEV_USER_PASSWORD=vagrant DIB_DEV_USER_SHELL=/bin/bash disk-image-create debian vm devuser simple-init
- qemu-img convert -f qcow2 -O vmdk image.qcow2 image.vmdk # Convert qcow2 to vmdk (vmware)
- scp root@192.168.46.129:/root/image.vmdk ./image.vmdk


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

