#!/bin/bash -eux

# Add vagrant user to sudoers for password-less sudo
# https://www.vagrantup.com/docs/boxes/base.html#password-less-sudo
echo "vagrant        ALL=(ALL)       NOPASSWD: ALL" >> /etc/sudoers

# Remove requiretty from /etc/sudoers if it exists
sed -i "s/^.*requiretty/#Defaults requiretty/" /etc/sudoers
