- Create the image builder
```
docker build --tag image-builder:bionic .
docker run --rm -it --privileged -v $PWD/images:/app -v $PWD/elements:/elements image-builder:bionic /bin/bash
```

- Create the image disk
```
disk-image-create -o stretch_1 debian vm debian-systemd growroot kubernetes cloud-init

export break=after-error
export DIB_RELEASE=stretch
export DIB_APT_MINIMAL_CREATE_INTERFACES=0
disk-image-create -o stretch_1 debian vm cloud-init

export break=after-error
export DIB_RELEASE=stretch
export DIB_APT_MINIMAL_CREATE_INTERFACES=0
disk-image-create -o stretch_2 debian vm cloud-init debian-networking-fix cloud-init-fix

export break=after-error
export DIB_RELEASE=stretch
export DIB_APT_MINIMAL_CREATE_INTERFACES=0
disk-image-create -o stretch_3 debian vm cloud-init debian-networking-fix cloud-init-fix kubernetes

export break=after-error
export DIB_RELEASE=stretch
export DIB_APT_MINIMAL_CREATE_INTERFACES=0
disk-image-create -o stretch_4 debian vm cloud-init debian-networking-fix cloud-init-fix kubernetes growroot

export break=after-error
export DIB_RELEASE=stretch
export DIB_APT_MINIMAL_CREATE_INTERFACES=0
disk-image-create -o stretch_5 debian vm debian-networking-fix cloud-init-fix kubernetes growroot qemu-guest

export break=after-error
export DIB_RELEASE=buster
export DIB_APT_MINIMAL_CREATE_INTERFACES=0
disk-image-create -o buster_1 debian vm cloud-init 

export break=after-error
export DIB_RELEASE=buster
export DIB_APT_MINIMAL_CREATE_INTERFACES=0
disk-image-create -o buster_2 debian vm cloud-init debian-networking-fix

export break=after-error
export DIB_RELEASE=bionic
export DIB_APT_MINIMAL_CREATE_INTERFACES=0
disk-image-create -o bionic_1 ubuntu vm cloud-init
```

- Resize qcow2 disk to 32 GB
```
qemu-img resize /data/images/images/100/vm-100-disk-0.qcow2 32G
```

- Boot image with qemu 
```
./boot_qemu.sh images/stretch_3.qcow2
```

- Run tests to see if the image is OK
  - root partition is grown to 32G
  - kubelet service
  - kubectl, kubeadm, kubelet same versions
  - docker daemon uses systemd as cgroup driver

NOTE: Proxmox KVM will hang at 100% CPU when there is no serial port configured for a diskimage-create image.
https://bugs.launchpad.net/cloud-images/+bug/1573095
Immediate fix is to add a serial console to the VM
- Create new VM in proxmox
  - 32 GB disk
  - 2 CPUs
  - Serial Port
  - CloudInit Drive
  - VGA to serial0
  - Replace qcow2 disk with our created disk
  - Enable qemu-agent

- Sync image to proxmox
```
scp image.qcow2 mediacenter:/images/image.qcow2
cp -v /data/images/image.qcow2 /data/images/images/100/vm-100-disk-0.qcow2
qm rescan
```

- Boot VM

---

- Useful elements for debugging
```
journal-to-console
devuser
```

- Checking contents of /tmp folder of created qcow image:
```
guestfish
add stretch_2.qcow2
run
list-filesystems
mount /dev/sda1 /
ls /tmp
```

- Boot image with vmware
```
qemu-img convert -f qcow2 -O vmdk image.qcow2 image.vmdk
```
