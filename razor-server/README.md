## Setup

1. Boot razor-server
```
vagrant up
```

2. Register the target machine in razor

```
razor register-node \
  --hw-info net0=08:00:27:dd:1d:77 \
  --hw-info serial=0 \
  --installed false \

razor update-node-metadata --node node1 --key TARGET_DISK --value /dev/sda
razor update-node-metadata --node node1 --key DISK_URL --value http://razor-server:8150/svc/repo/libvirt/libvirt_buster.qcow2
```

3. Boot network only VM
```
vagrant up pxe
```

4. Wait for the networking machine to provision

---

## Debugging

```
razor nodes
=> copy dhcp_mac
http://razor-server:8150/svc/boot?net0=08:00:27:60:d3:70

razor nodes node2 facts
http://razor-server:8150/svc/repo/deploy-image/deploy-image.kernel
http://razor-server:8150/svc/repo/libvirt/libvirt_buster.qcow2
```

Login Centos microkernel
```
username: root
password: thincrust
```
