Bridge networking in Macos and Qemu
- https://www.emaculation.com/forum/viewtopic.php?f=34&t=10411
- https://superuser.com/questions/670545/how-do-i-create-a-wifi-network-bridge-with-qemu-on-os-x
- https://www.dzombak.com/files/qemu-bridging-mavericks.pdf

- Create the bridge interface
sudo ifconfig bridge1 create

- Add en0 (wifi) to bridge1
sudo ifconfig bridge1 addm en0

- Enable the bridge
sudo ifconfig bridge1 up

 -net nic,model=virtio \
 -net tap,script=./qemu-ifup.sh,downscript=./qemu-ifdown.sh \
 -netdev tap,id=xxx,ifname=tap1,script=no,downscript=no -device e1000,netdev=xxx \

 sudo route -n add -net 10.67.0.0/16  192.168.120.254
 sudo route -n add -host 192.168.1.10 tap1
 sudo route add -host 192.168.1.10 tap1
