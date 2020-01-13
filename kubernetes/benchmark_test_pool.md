## TODO

- more disks for raid 10
- test NFS on regular disk, no zfs
- upgrade zfs and zpool
  - zfs upgrade my_pool
  - zpool upgrade my_pool
- check NFS latency
- lvm instedad of qcow2 for the vms
- no writeback cache in vm?
- slog, zil, l2arc
- Get the physical sector size for the disks and update the zfs zpool ashift setting accordingly.
- use iscsi instead of nfs
  - https://comm-tech.org/setting-up-iscsi-with-tgtadm-server-and-using-open-iscsi-client/
  - https://wiki.debian.org/SAN/iSCSI/LIO

---
from: https://www.reddit.com/r/sysadmin/comments/669sz1/slow_nfs_datastore_read_performance_centos_73_and/
zfs set xattr=sa - Can dramatically impact performance
zfs set acltype=posixacl - Just in case
zfs set compress=lz4 - There's no downside to enabling compression
zfs set atime=off - obvious
---
https://www.ateamsystems.com/tech-blog/solved-performance-issues-with-freebsd-zfs-backed-esxi-storage-over-nfs/
Setting vfs.zfs.cache_flush_disable="1" in /boot/loader.conf
---
https://forum.proxmox.com/threads/solved-bad-io-performance-with-ssd-over-nfs-from-vm.32588/
io scheduler deadline
---
https://www.ixsystems.com/community/threads/random-write-performance-within-a-vm.42338/

## Setup

```
zpool create test_pool ata-TOSHIBA_HDWN180_Y9PPK11BFAVG
zpool create test_pool_ssd ata-SAMSUNG_SSD_830_Series_S0XXNYAC300558
```

## Tools

- bonnie++
- fio
- iozone (Make sure to enable non-free sources https://serverfault.com/a/240921)
- dd

## Testing commands

```
arc_summary
zpool iostat -n 1
zdb
```

## Testing NFS settings

https://martin.heiland.io/2018/02/23/zfs-tuning/

```
mount 172.16.0.1:/test_pool /test_pool
fio --filename=test --sync=1 --rw=randread --bs=4k --numjobs=1 --iodepth=4 --group_reporting --name=test --filesize=10G --runtime=300 && rm test
```

local - recordsize=128K,dedup=off,compression=lz4,sync=disabled,ashift=12
4K randread: IOPS=36.5k, BW=143MiB/s (149MB/s)(10.0GiB/71823msec) 

vm/nfs - e1000,recordsize=128K,dedup=off,compression=lz4,sync=disabled,ashift=12
4K randread: IOPS=2875, BW=11.2MiB/s (11.8MB/s)(3369MiB/300001msec) 

vm/zfs-nfs - e1000,recordsize=128K,dedup=off,compression=lz4,sync=disabled,ashift=12
zfs set sharenfs="rw=@172.16.0.0/24" test_pool
4K randread: IOPS=2826, BW=11.0MiB/s (11.6MB/s)(3313MiB/300001msec)

vm/zfs-nfs - virtio,recordsize=128K,dedup=off,compression=lz4,sync=disabled,ashift=12
4K randread: IOPS=3042, BW=11.9MiB/s (12.5MB/s)(3565MiB/300001msec)
4K seqread: IOPS=115k, BW=447MiB/s (469MB/s)(10.0GiB/22888msec)

vm/zfs-nfs - nfs-async,recordsize=128K,virtio,dedup=off,compression=lz4,sync=disabled,ashift=12
mount -t nfs -o async 172.16.0.1:/test_pool /test_pool
4K randread: IOPS=5394, BW=21.1MiB/s (22.1MB/s)(6322MiB/300001msec)

vm/zfs-nfs - recordsize=1M,virtio,dedup=off,compression=lz4,sync=disabled,ashift=12
zfs set recordsize=1M test_pool
4K randread: IOPS=3041, BW=11.9MiB/s (12.5MB/s)(3565MiB/300001msec)

vm/zfs-nfs - recordsize=4K,virtio,dedup=off,compression=lz4,sync=disabled,ashift=12
zfs set recordsize=4K test_pool
4K randread: IOPS=6192, BW=24.2MiB/s (25.4MB/s)(7257MiB/300001msec)

vm/zfs-nfs - recordsize=8K,virtio,dedup=off,compression=lz4,sync=disabled,ashift=12
zfs set recordsize=8K test_pool
4K randread: IOPS=6328, BW=24.7MiB/s (25.9MB/s)(7416MiB/300001msec)

vm/zfs-nfs - recordsize=16K,virtio,dedup=off,compression=lz4,sync=disabled,ashift=12
zfs set recordsize=16K test_pool
4K randread: IOPS=6326, BW=24.7MiB/s (25.9MB/s)(7414MiB/300001msec)

vm/zfs-nfs - recordsize=32K,virtio,dedup=off,compression=lz4,sync=disabled,ashift=12
zfs set recordsize=32K test_pool
4K randread: IOPS=6302, BW=24.6MiB/s (25.8MB/s)(7385MiB/300001msec)

vm/zfs-nfs - xattr=sa,recordsize=128K,virtio,dedup=off,compression=lz4,sync=disabled,ashift=12
zfs set xattr=sa test_pool
4K randread: IOPS=3032, BW=11.8MiB/s (12.4MB/s)(3554MiB/300001msec)

vm/zfs-nfs - atime=off,recordsize=128K,virtio,dedup=off,compression=lz4,sync=disabled,ashift=12
zfs set atime=off test_pool
4K randread: IOPS=3055, BW=11.9MiB/s (12.5MB/s)(3581MiB/300001msec)

vm/zfs-nfs - acltype=posixacl,recordsize=128K,virtio,dedup=off,compression=lz4,sync=disabled,ashift=12
zfs set acltype=posixacl test_pool
4K randread: IOPS=3058, BW=11.9MiB/s (12.5MB/s)(3584MiB/300001msec)

vm/zfs-nfs - mtu=9000,recordsize=128K,virtio,dedup=off,compression=lz4,sync=disabled,ashift=12
ip link set eth1 mtu 9000
ip link set vmbr1 mtu 9000
4K randread: IOPS=6612, BW=25.8MiB/s (27.1MB/s)(1024MiB/39641msec)

vm/zfs-nfs - nfs-async,mtu=9000,recordsize=16K,virtio,dedup=off,compression=lz4,sync=disabled,ashift=12
ip link set eth1 mtu 9000
ip link set vmbr1 mtu 9000
4K randread: IOPS=6935, BW=27.1MiB/s (28.4MB/s)(1024MiB/37795msec)

## Check network connectivity

iperf testing:
```
iperf -s -B 172.16.0.1
iperf -c 172.16.0.1
```

E1000 network adapter:

Client connecting to 172.16.0.1, TCP port 5001
TCP window size: 2.50 MByte (default)
------------------------------------------------------------
[  3] local 172.16.0.2 port 40550 connected with 172.16.0.1 port 5001
[ ID] Interval       Transfer     Bandwidth
[  3]  0.0-10.0 sec  1.49 GBytes  1.28 Gbits/sec

virtio network adapter:

Client connecting to 172.16.0.1, TCP port 5001
TCP window size: 85.0 KByte (default)
------------------------------------------------------------
[  3] local 172.16.0.2 port 55234 connected with 172.16.0.1 port 5001
[ ID] Interval       Transfer     Bandwidth
[  3]  0.0-10.0 sec  25.6 GBytes  22.0 Gbits/sec
