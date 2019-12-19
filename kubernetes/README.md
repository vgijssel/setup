- Create the qcow image
  
```
docker build --tag image-builder:bionic .
```
  
```
docker run --rm -it --privileged -v $PWD/images:/app -v $PWD/elements:/elements image-builder:bionic /bin/bash
```

Useful elements for debugging
```
journal-to-console
devuser
```

```
export DIB_RELEASE=buster
export DIB_DEV_USER_SHELL=/bin/bash
export DIB_DEV_USER_PWDLESS_SUDO=yes
export DIB_DEV_USER_PASSWORD=devuser
export DIB_DEV_USER_USERNAME=devuser

disk-image-create -o test_debian_kubernetes debian dhcp-all-interfaces vm devuser debian-systemd growroot kubernetes
```  


- Boot image with vmware

```
qemu-img convert -f qcow2 -O vmdk image.qcow2 image.vmdk
```

- Boot image with qemu
  - run tests to see if the image is OK
  - HAXM is enabled on GitHub Actions macos nodes
    which can be used to boot vms

```
 qemu-system-x86_64 \
  -m 2048 \
  -vga virtio \
  -show-cursor \
  -usb \
  -device usb-tablet \
  -enable-kvm \
  -drive file=vm-100-disk-0.qcow2,if=virtio \
  -accel hvf \
  -cpu host
```

- Sync image to /var/lib/vz/template in proxmox

```
scp image.qcow2 mediacenter:/images/image.qcow2
```

- Update proxmox

```
qm rescan
```

- Create new VM in proxmox
  - 32 GB disk
- Replace qcow2 disk with our created disk

```
mv -v /data/images/image.qcow2 /data/images/images/100/vm-100-disk-0.qcow2
```

- Resize qcow2 disk to 32 GB (same as VM creation)

```
qemu-img resize /data/images/images/100/vm-100-disk-0.qcow2 32G
```

- Boot VM

NOTE: Proxmox KVM will hang at 100% CPU when there is no serial port configured for a diskimage-create image.
https://bugs.launchpad.net/cloud-images/+bug/1573095
Immediate fix is to add a serial console to the VM
