TODO:

- The ApiUrl GO variable is pointing to the IP address of the instance, not the FQDN
- curtin with OSSUBTYPE=ubuntu causes systemd / to not be printed to console
  - maybe grub config thing?
  - GRUB_TERMINAL to tty/ ?
  
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
    "image-deploy/image-type": "tgz"
  },
  "Profiles": []
}
```
