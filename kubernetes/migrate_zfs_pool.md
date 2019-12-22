ls -la /dev/disk/by-id
lsblk
zpool create -o ashift=12 new_data disk1 disk2 disk3

zfs get compression
zfs set compression=lz4 new_data

zfs create new_data/docs
zfs set dedup=on new_data/docs

zfs create new_data/proxmox
zfs set dedup=on new_data/proxmox

zfs create new_data/media
zfs set dedup=on new_data/media

zfs create new_data/downloads
zfs set dedup=on new_data/downloads

apt-get install -y pv
https://unix.stackexchange.com/questions/263677/how-to-one-way-mirror-an-entire-zfs-pool-to-another-zfs-pool

screen

zfs snapshot -r tank0@migrate
zfs send -vR tank0@migrate | pv | zfs receive -u new_data/migrate
zfs set mountpoint=/new_data/migrate new_data/migrate
zfs mount new_data/migrate
zfs unmount new_data/migrate
zfs unmount new_data

- Migrate all data from new_data/migrate into data
zfs send -vR new_data/migrate@migrate | pv | zfs receive -Fuv new_data

- Destroy the migrate snapshot of the migrate dataset
zfs destroy new_data/migrate@migrate

- Destroy the migrate dataset
zfs destroy new_data/migrate

- Destroy the migrate snapshot of the zpool dataset
zfs destroy new_data@migrate

- Mount the filesystem
zfs mount new_data

zfs snapshot -r new_data/downloads@test
zfs send -vR new_data/downloads@test | zfs receive -Fuv new_data
zfs list -t snapshot
zfs destroy new_data/downloads@test
