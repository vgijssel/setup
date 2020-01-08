Changes:
- Install nfs server
  - https://forum.proxmox.com/threads/nfs-share-from-proxmox-host.20549/
  - https://wiki.debian.org/NFSServerSetup
- Disable no license pop-up
- Setup appropriate apt sources

TODO:
- periodically check for folders with large number of files, like crashplan logs

## Copy public key into authorized keys
- List public keys in OpenSSH format
```
ssh -L
```

- Add the key to `/etc/pve/priv/authorized_keys`

## Setup internal network


## Setup NFS

- Install packages
```
apt-get install nfs-kernel-server nfs-common
```

- Update config `/etc/exports`
```
```

- Restart NFS
```
systemctl restart nfs-kernel-server
```
