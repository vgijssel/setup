## Setup

1. Boot dnsmasq, razor and pxe machine and provision pxe machine
```
vagrant up
```

## Debugging

```
razor nodes
=> copy dhcp_mac
http://razor-server:8150/svc/boot?net0=08:00:27:60:d3:70

razor nodes node1 facts
http://razor-server:8150/svc/repo/deploy-image/deploy-image.kernel
http://razor-server:8150/svc/repo/libvirt/libvirt_buster.qcow2
```

Login Centos microkernel
```
username: root
password: thincrust
```
