ls -la /dev/disk/by-id
lsblk
zpool create -o ashift=12 new_data disk1 disk2 disk3


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

- zfs unmount old pool
zfs unmount tank0

- Update the old pool mountpoint
zfs set mountpoint=/old_data tank0

- Update the new pool mountpoint
zfs set mountpoint=/data new_data

- Mount the filesystem
zfs mount new_data


zfs get compression
zfs set compression=lz4 new_data
zfs snapshot -r new_data@initial

mv -v /data/docs /data/docs2
zfs create new_data/docs
zfs set dedup=on new_data/docs
screen
rsync --info=progress2 -avz /data/docs2/ /data/docs

mv -v /data/media /data/media2
zfs create new_data/media
zfs set dedup=on new_data/media
screen
rsync --info=progress2 -avz /data/media2/ /data/media

zfs create new_data/proxmox
zfs set dedup=on new_data/proxmox

zfs create new_data/media
zfs set dedup=on new_data/media

zfs create new_data/downloads
zfs set dedup=on new_data/downloads

Enable NFS sharing of ZFS datasets
zfs set sharenfs=on new_data/docs

## Migrating stripe to raid1

raid1:
ata-TOSHIBA_HDWN180_89E5K11IFAVG
ata-TOSHIBA_HDWN180_89E3K14GFAVG

nothing:
ata-TOSHIBA_HDWN180_Y9PPK11BFAVG

- remove drives from stripe
zpool remove new_data ata-TOSHIBA_HDWN180_89E3K14GFAVG
zpool remove new_data ata-TOSHIBA_HDWN180_Y9PPK11BFAVG

- create new mirror from removed disk
zpool attach new_data ata-TOSHIBA_HDWN180_89E5K11IFAVG ata-TOSHIBA_HDWN180_89E3K14GFAVG

- after resilvering scrub the tank to check for errors
zpool scrub tank

## Migrating raid1 to raid10

- Use -n to get dry run information
zpool add -n new_data mirror ata-TOSHIBA_HDWN180_Y9PPK11BFAVG ata-TOSHIBA_HDWN180_Y9SAK1FCFAVG
zpool add new_data mirror ata-TOSHIBA_HDWN180_Y9PPK11BFAVG ata-TOSHIBA_HDWN180_Y9SAK1FCFAVG

- problem with freezing / crashing https://forum.proxmox.com/threads/proxmox-v6-servers-freeze-zvol-blocked-for-more-than-120s.57765/page-3
apt-get update
apt dist-upgrade
