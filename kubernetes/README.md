- Create the qcow image
  
```
docker build --tag image-builder:bionic .
```
  
```
docker run --rm -it --privileged -v $PWD/images:/app image-builder:bionic /bin/bash
```

```
export DIB_RELEASE=buster
export DIB_DEV_USER_SHELL=/bin/bash
export DIB_DEV_USER_PWDLESS_SUDO=yes
export DIB_DEV_USER_PASSWORD=devuser
export DIB_DEV_USER_USERNAME=devuser
disk-image-create debian dhcp-all-interfaces vm devuser
```  


- Boot image with vmware

```
qemu-img convert -f qcow2 -O vmdk image.qcow2 image.vmdk
```

 
- Boot image with qemu
  - run tests to see if the image is OK
  - HAXM is enabled on GitHub Actions macos nodes
    which can be used to boot vms

- Sync image to /var/lib/vz/template in proxmox

```

```

- create VM proxmox
- join cluster
