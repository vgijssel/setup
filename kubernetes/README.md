- Create the qcow image
  
```
docker build --tag image-builder .
```
  
```
docker run --rm -it --privileged image-builder /bin/bash
```

  
export DIB_DEV_USER_AUTHORIZED_KEYS=/keys
```
export DIB_RELEASE=buster
export DIB_DEV_USER_SHELL=/bin/bash
export DIB_DEV_USER_PWDLESS_SUDO=yes
export DIB_DEV_USER_PASSWORD=devuser
export DIB_DEV_USER_USERNAME=devuser
disk-image-create debian debian-systemd dhcp-all-interfaces vm devuser
```  

 
- boot image using macos qemu
  - run tests to see if the image is OK
  - HAXM is enabled on GitHub Actions macos nodes
    which can be used to boot vms

- sync image to /var/lib/vz/template in proxmox
- create VM proxmox
- join cluster
