TODO:

- Print systemd to both console and serial https://github.com/systemd/systemd/issues/9899
- The ApiUrl GO variable is pointing to the IP address of the instance, not the FQDN
  
Libvirt settings profile
```
{
  "Validated": true,
  "Available": true,
  "Errors": [],
  "ReadOnly": false,
  "Meta": {
    "color": "black",
    "icon": "tags",
    "title": "User added"
  },
  "Endpoint": "",
  "Bundle": "",
  "Partial": false,
  "Name": "Libvirt Settings",
  "Description": "",
  "Documentation": "",
  "Params": {
    "curtin/debug": true,
    "curtin/network/template": "network_config",
    "image-deploy/image-file": "files/images/libvirt.tgz",
    "image-deploy/image-os": "linux",
    "image-deploy/image-os-subtype": "ubuntu",
    "image-deploy/image-type": "tgz",
    "kernel-console": "console=tty0 console=ttyS0,115200"
  },
  "Profiles": []
}
```
