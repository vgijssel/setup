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

- create linux bridge in proxmox
- reboot

172.16.0.1/24

|hostname|ip         |
|--------|-----------|
|proxmox |172.16.0.1 |
|master  |172.16.0.2 |
|worker1 |172.16.0.3 |
|worker2 |172.16.0.4 |
|worker3 |172.16.0.5 |


## Setup NFS

- Install packages
```
apt-get install nfs-kernel-server nfs-common
```

- Update config `/etc/exports`
```
/data 172.16.0.0/24(rw,no_root_squash,subtree_check)
```

- Restart NFS
```
systemctl restart nfs-kernel-server
```

- Mount folder in vm

```
mount 172.16.0.1:/data /data
```
