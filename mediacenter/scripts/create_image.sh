#!/bin/bash

set -e
set +x

export DEBIAN_FRONTEND=noninteractive
export DIB_PYTHON_VERSION=3
export DIB_DEV_USER_USERNAME=vagrant
export DIB_DEV_USER_PASSWORD=vagrant
export DIB_DEV_USER_PWDLESS_SUDO=yes
export DIB_DEV_USER_SHELL=/bin/bash

export DIB_RELEASE=stretch
export DIB_RELEASE=buster
export DIB_RELEASE=stable

export DIB_RELEASE=xenial

# trying to build an iso using `disk-image-create <dist> iso`
# host image     - guest image    - success?
# debian stretch - debian stretch - E: Unable to locate package grub-efi-amd64-signed, : Unable to locate package shim-signed
# debian stretch - debian buster  - cp: cannot stat '/usr/lib/shim/shim.efi.signed': No such file or directory
# debian stretch - debian stable  - cp: cannot stat '/usr/lib/shim/shim.efi.signed': No such file or directory
# debian stretch - ubuntu bionic  - cp: cannot stat '/usr/lib/shim/shim.efi.signed': No such file or directory
# debian stretch - ubuntu xenial  - cp: cannot stat '/usr/lib/shim/shim.efi.signed': No such file or directory

# debian buster  - debian stretch - docker: hangs at configuring apt...

# ubuntu bionic  - debian stretch - E: Unable to locate package shim-signed, E: Unable to locate package grub-efi-amd64-signed
# ubuntu bionic  - debian buster  - cp: cannot stat '/usr/lib/shim/shim.efi.signed': No such file or directory
# ubuntu bionic  - ubuntu bionic  - cp: cannot stat '/usr/lib/shim/shim.efi.signed': No such file or directory
# ubuntu bionic  - ubuntu xenial  - ...


## TEST
apt-get update && \
apt-get install -y dialog apt-utils && \
apt-get install -y shim-signed syslinux isolinux syslinux-common

# check
# /usr/lib/grub/x86_64-efi-signed/grubx64.efi.signed
# /usr/lib/ISOLINUX/isolinux.bin
# /usr/lib/syslinux/modules/bios/ldlinux.c32
# /usr/lib/shim/shimx64.efi.signed

# ubuntu:bionic
# ubuntu:xenial
# ubuntu:trusty
# ubuntu:cosmic
# ubuntu:artful
# ubuntu:zesty
# ubuntu:saucy
# ubuntu:raring

# UEFI debian buster
# install diskimage-builder from git
# https://docs.openstack.org/diskimage-builder/latest/developer/invocation.html

export DIB_IMAGE_ROOT_FS_UUID=$(uuidgen -r)
mkdir /images
tox -e venv -- disk-image-create -o /images iso debian baremetal

# issue with -e
# https://github.com/rear/rear/issues/588
# mkisofs
# xorrisofs
# genisoimage


# 2019-11-27 08:54:26.850 | > EFI variables are not supported on this system
# 2019-11-27 08:54:46.242 | > /sys/firmware/efi/efivars not found, aborting.


# Using Debian 9 (stretch)

# simple-init is for networking
# devuser is to be able to login into the machine for developing

# doing baremetal (instead of vm) will not directly result into a bootable image for vmware
# probably need to do something with the generated kernel
# baremetal + iso

# dib-python <-- use this python to run ansible playbook in local mode?
# disable-nouveau <-- for nvidia GPU

# bootloader
# grub
disk-image-create -o /images/image -t qcow2 --image-cache /cache debian debian-systemd dhcp-all-interfaces devuser baremetal iso

# Convert .qcow2 to .vmdk to be able to load the disk in VMware
qemu-img convert -f qcow2 -O vmdk /images/image.qcow2 /images/image.vmdk

