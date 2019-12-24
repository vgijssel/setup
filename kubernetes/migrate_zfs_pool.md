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

## Performance tuning
apt-get install bonnie++
https://calomel.org/zfs_raid_speed_capacity.html

bonnie++ -u root -r 1024 -s 16384 -d /storage -f -b -n 1 -c 4

zfs set sync=disabled new_data
zfs set dedup=off new_data/media

zpool add new_data cache ata-SAMSUNG_SSD_830_Series_S0XXNYAC300558
zpool remove new_data cache ata-SAMSUNG_SSD_830_Series_S0XXNYAC300558
zpool add new_data log ata-SAMSUNG_SSD_830_Series_S0XXNYAC300558
zpool remove new_data ata-SAMSUNG_SSD_830_Series_S0XXNYAC300558

arc_summary
zpool iostat
