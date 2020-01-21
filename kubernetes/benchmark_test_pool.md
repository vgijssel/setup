## NFS improvements so far:
- virtio network adapter
- udp protocol NFS client
- async client and server
- move sata cables to motherboard connectors instead of raid card
- primary cache (https://forum.proxmox.com/threads/benchmark-zfs-vs-mdraid-ext4-qcow2.49899/#post-236712)
- disable ZFS dedup

## TODO
- test NFS on regular disk, no zfs
- atime=off
- xattr=sa (https://pve.proxmox.com/wiki/ZFS:_Tips_and_Tricks)
- dnodesize=auto (https://pve.proxmox.com/wiki/ZFS:_Tips_and_Tricks)
- recordsize=64K
- writeback cache in harddrive in proxmox?
- nfs rsize,wsize
- upgrade zfs and zpool
  - zfs upgrade my_pool
  - zpool upgrade my_pool
- check NFS latency (nfsiostat)
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
vmstat 1
nfsiostat 1 /benchmarking/test_pool_ssd_nfs
iostat 1 -x
```

## Testing NFS settings

https://martin.heiland.io/2018/02/23/zfs-tuning/

```
zfs set sharenfs="rw=@172.16.0.0/24,no_root_squash,no_subtree_check"

mount 172.16.0.1:/test_pool /test_pool test_pool
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


# Testing regular disk

## Setup

```
mkfs.ext4 /dev/sdb
e2label /dev/sdb test_disk
mkdir /test_disk
mount /dev/sdb /test_disk
```

/etc/exports
```
/test_disk 172.16.0.0/24(rw,no_root_squash,no_subtree_check)

```

## Command

```
mkdir -p /benchmarking/test_disk_nfs
cd /benchmarking
mount -t nfs -o async 172.16.0.1:/test_disk /benchmarking/test_disk_nfs

rm -f test_disk_nfs/test && fio --filename=test_disk_nfs/test --sync=1 --rw=randread --bs=4k --numjobs=1 --iodepth=4 --group_reporting --name=test --filesize=1G --runtime=300
```

## Results

local
4K randread: IOPS=5180, BW=20.2MiB/s (21.2MB/s)(1024MiB/50602msec)

local-nfs - nfs-async
4K randread: IOPS=21.8k, BW=85.3MiB/s (89.5MB/s)(10.0GiB/120003msec)

vm-nfs - nfs-async
4K randread: IOPS=7761, BW=30.3MiB/s (31.8MB/s)(1024MiB/33773msec)

```
umount /test_disk
zpool create test_pool_ssd ata-SAMSUNG_SSD_830_Series_S0XXNYAC300558
zfs set compression=lz4 sync=disabled sharenfs="rw=@172.16.0.0/24,no_root_squash,no_subtree_check,async" test_pool_ssd

mkdir -p /benchmarking/test_pool_ssd_nfs
mount -t nfs -o async,proto=udp 172.16.0.1:/test_pool_ssd /benchmarking/test_pool_ssd_nfs
cd /benchmarking/test_pool_ssd_nfs

rm -f test && fio --filename=test --sync=1 --rw=randread --bs=4k --numjobs=1 --iodepth=4 --group_reporting --name=test --filesize=1G --runtime=300
```

zfs-local
4K randread: IOPS=41.0k, BW=160MiB/s (168MB/s)(10.0GiB/63862msec)

zfs-local-nfs
4K randread: IOPS=15.5k, BW=60.6MiB/s (63.5MB/s)(1024MiB/16909msec)

zfs-vm-nfs
4K randread: IOPS=6490, BW=25.4MiB/s (26.6MB/s)(1024MiB/40388msec)

zfs-vm-nfs,proto=udp
4K randread: IOPS=6879, BW=26.9MiB/s (28.2MB/s)(1024MiB/38104msec)


# Testing pool

## Articles
- http://www.admin-magazine.com/HPC/Articles/Useful-NFS-Options-for-Tuning-and-Management
- https://cromwell-intl.com/open-source/performance-tuning/nfs.html 

```
cat /proc/net/rpc/nfs | grep th
nfsstat -s -4
mountstats /benchmarking/test_pool_nfs
cat /etc/default/nfs-kernel-server
```

## Setup

```
zfs set sharenfs="rw=@172.16.0.0/24,no_root_squash,no_subtree_check,async" new_data
```

## Command

```
umount /benchmarking/test_pool_nfs
mkdir -p /benchmarking/test_pool_nfs
mount -t nfs -o async 172.16.0.1:/data /benchmarking/test_pool_nfs
cd /benchmarking/
rm -f test_pool_nfs/test && fio --filename=test_pool_nfs/test --sync=1 --rw=randread --bs=4k --numjobs=1 --iodepth=4 --group_reporting --name=test --filesize=1G --runtime=300

rm -f test_pool_nfs/test && fio --filename=test_pool_nfs/test --sync=1 --rw=read --bs=4k --numjobs=1 --iodepth=4 --group_reporting --name=test --filesize=1G --runtime=300

rm -f test_pool_nfs/test && fio --filename=test_pool_nfs/test --sync=1 --rw=randwrite --bs=4k --numjobs=1 --iodepth=4 --group_reporting --name=test --filesize=1G --runtime=300
```

## Results

local
4K randread: IOPS=40.2k, BW=157MiB/s (165MB/s)(10.0GiB/65207msec)

local-nfs - nfs-async
4K randread: IOPS=14.9k, BW=58.2MiB/s (61.1MB/s)(1024MiB/17585msec)

vm-nfs - nfs-async
4K randread: IOPS=6491, BW=25.4MiB/s (26.6MB/s)(1024MiB/40381msec)
4K randwrite: IOPS=2878, BW=11.2MiB/s (11.8MB/s)(1024MiB/91064msec); 0 zone resets

vm-nfs - nfs-async,RPCNFSDCOUNT=64
4K randread: IOPS=6858, BW=26.8MiB/s (28.1MB/s)(1024MiB/38221msec)

vm-nfs - nfs-async,mtu=9000
ip link set eth1 mtu 9000
ip link set eth1 down
ip link set eth1 up
ip link set vmbr1 mtu 9000
ip link set eth1 down
ip link set eth1 up
4K randread: Stuck

vm-nfs - nfs-async,rsize=4096
4K randread: IOPS=6471, BW=25.3MiB/s (26.5MB/s)(1024MiB/40505msec)

vm-nfs - nfs-async,rsize=4096,wsize=4096
4K randread: IOPS=6486, BW=25.3MiB/s (26.6MB/s)(1024MiB/40416msec)

vm-nfs  - nfs-async,zfs_prefetch_disable=1
echo 1 >> /sys/module/zfs/parameters/zfs_prefetch_disable
4K randread: IOPS=6462, BW=25.2MiB/s (26.5MB/s)(1024MiB/40566msec)







### Testing ZFS vs SSD storage

```
rm -f test && fio --filename=test --sync=1 --rw=randread --bs=4k --numjobs=1 --iodepth=4 --group_reporting --name=test --filesize=1G --runtime=300
```

vm-ssd-qcow2
4K randread: IOPS=3569, BW=13.9MiB/s (14.6MB/s)(4183MiB/300001msec)

vm-zfs,volblocksize=4K
4K randread: IOPS=11.5k, BW=44.8MiB/s (46.0MB/s)(1024MiB/22865msec)

vm-zfs,volblocksize=8K
4K randread: IOPS=12.1k, BW=47.1MiB/s (49.4MB/s)(1024MiB/21739msec)

vm-zfs-nfs
4K randread: IOPS=6508, BW=25.4MiB/s (26.7MB/s)(1024MiB/40280msec)

vm-zfs-nfs,recordsize=32K
4K randread: IOPS=7101, BW=27.7MiB/s (29.1MB/s)(1024MiB/36914msec)

vm-zfs-nfs,recordsize=64K
4K randread: IOPS=6842, BW=26.7MiB/s (28.0MB/s)(1024MiB/38310msec)

vm-zfs-nfs,recordsize=128K
4K randread: IOPS=6512, BW=25.4MiB/s (26.7MB/s)(1024MiB/40250msec)

```
mount -t nfs -o async 172.16.0.1:/data /data
```


Convert qcow2 to raw and import into ZFS zvol storage
```
qemu-img convert -f qcow2 -O raw kubernetes_buster.qcow2 kubernetes_buster.raw
dd if=/var/lib/vz/images/kubernetes_buster.qcow2 of=/dev/zvol/new_data/virtual_machines/vm-104-disk-0 bs=1M status=progress
```


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
