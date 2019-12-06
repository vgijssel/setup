Final state PXE will look like:

set cmdline image=https://github.com/mvgijssel/setup/archive/proxmox.tar.gz disk=/dev/sda4
kernel deploy-image/mvlinuz
initrd deploy-image/initrd.gz

The deploy-image will do the following:
- download specified image
- extract image
- convert image from qcow2 to raw
- write image to specified disk
- resize disk
- reboot into disk

## Resources

- razor-server microkernel built in CentOS https://github.com/puppetlabs/razor-el-mk/tree/a2602cf3bea64a55a404f1727b11cc6f8a48b779

Using debootstrap for Debian to create deploy-image
- http://laurent.claessens-donadello.eu/blog/php/debootstrap.php
- https://willhaley.com/blog/custom-debian-live-environment/

Presentation with resources for building debian images:
http://people.linaro.org/~riku.voipio/debian-images/#/19

live-build https://manpages.debian.org/testing/live-build/live-build.7.en.html

bootstrap-vz (deprecated)
vmdebootstrap (deprecated)

vmdb2: https://liw.fi/vmdb2/

debos: https://github.com/go-debos/debos

fai: https://fai-project.org/FAIme/#

openstack-debian-images: https://manpages.debian.org/testing/openstack-debian-images/build-openstack-debian-image.1.en.html
