```
eval $(minikube docker-env)
export RAZOR_API=http://minikube:8150/api
minikube mount $PWD:$PWD
docker run --rm -it -v $PWD/tasks:/tasks -v $PWD/etc/dnsmasq.conf:/etc/dnsmasq.conf -v $PWD/tftpboot/bootstrap.ipxe.0:/tftpboot/bootstrap.ipxe.0 --name razor-server --net=host razor-server
```

TODO
- store undionly as ".0" due to dnsmasq version installed
- Try to install dnsmasq 2.76 so we don't need the .0 suffix
- Use journcalctl as the command for the docker container, pointing to dnsmasq and razor-server
- Systemd in docker container
- Automagically generate bootstrap url for tftp
- razor register-node to make the node known beforehand
- razor hooks to start installation of qcow image?




```
razor create-repo --name=centos-6.4 --iso-url http://some.where/centos.iso --task centos
razor create-tag --name small --rule '["<=", ["num", ["fact", "processorcount"]], 2]'
razor create-broker --name=noop --broker-type=noop
razor create-policy --json policy.json

razor create-repo test --task test --no_content
razor create-tag --name small --rule '["<=", ["num", ["fact", "processorcount"]], 2]'
razor create-broker --name=noop --broker-type=noop
razor create-policy --json policy.json
```

## Setup macos (https://blog.san-ss.com.ar/2016/04/setup-nat-network-for-qemu-macosx)

Make sure that qemu can use tap and ifconfig without entering password
```
sudo chown $(whoami):staff tun*
sudo chown $(whoami):staff tap*

cat <<EOF | tee /private/etc/sudoers.d/ifconfig_sudoers
%staff ALL = NOPASSWD: /sbin/ifconfig
EOF
```

```
sudo ifconfig bridge1 create
sudo ifconfig bridge1 192.168.100.1/24
sudo sysctl -w net.inet.ip.forwarding=1
sudo sysctl -w net.link.ether.inet.proxyall=1
sudo pfctl -F all # This flushes all active rules
sudo pfctl -f pfnat -e # Enable pf with the config
```

## Booting a diskimage-builder created ramdisk with pixiecore
1. Create the ramdisk
```
ramdisk-image-create -x -o images/deploy-image ramdisk debian hwdiscovery
```

2. start dnsmasq
```
sudo dnsmasq -d --interface=bridge1 --dhcp-range=192.168.100.10,192.168.100.50,1h --log-queries
```

3. Boot qemu machine

```
./boot_qemu.sh images/kubernetes_buster.qcow2
```

4. Copy the ramdisk
```
scp images/deploy-image.initramfs images/deploy-image.kernel debian@192.168.100.28:/home/debian
```

5. SSH into machine
```
ssh debian@192.168.100.28
```

6. Boot pixiecore inside qemu machine (macports version)
```
sudo su

docker run \
  --rm \
  -it \
  --net=host \
  -v /home/debian:/images \
  danderson/pixiecore \
  boot /images/deploy-image.kernel /images/deploy-image.initramfs \
  --cmdline "console=ttyS0,115200 BOOTIF=52:54:00:83:3d:02"
```

7. Start qemu in network boot

TODO: the booted ramdisk stdout is not going to the serial port it seems

```
qemu-system-x86_64 \
  -boot n \
  -m 2048 \
  -nographic \
  -smp 2 \
  -accel hax \
  -netdev tap,id=mynet0,script=qemu-ifup.sh,downscript=qemu-ifdown.sh \
  -device virtio-net,mac=52:54:00:83:3d:02,netdev=mynet0 \
  -device virtio-rng-pci
```

## Booting a diskimage-builder created ramdisk with razor-server
1. Create the ramdisk
```
tox -e venv -- ramdisk-image-create -x -o ../images/deploy-image ramdisk debian hwburnin-new
```

2. start dnsmasq
```
sudo dnsmasq -d --interface=bridge1 --dhcp-range=192.168.100.10,192.168.100.50,1h --log-queries
```

3. Boot qemu machine

```
./boot_qemu.sh images/kubernetes_buster.qcow2
```

4. Copy the ramdisk
```
scp images/deploy-image.initramfs images/deploy-image.kernel debian@192.168.100.41:/home/debian
```

5. Copy razor-server files
```
scp -r razor-server debian@192.168.100.43:/home/debian
```

6. SSH into machine
```
ssh debian@192.168.100.41
cd razor-server
```

7. Boot razor server and separate dnsmasq
```
sudo su
docker run --rm -it -v $PWD/tasks:/tasks -v $PWD/etc/dnsmasq.conf:/etc/dnsmasq.conf -v $PWD/tftpboot/bootstrap.ipxe.0:/tftpboot/bootstrap.ipxe.0 --name razor-server --net=host razor-server

docker exec -it xxxx /bin/bash
dnsmasq -d -C /etc/dnsmasq.conf
```

8. Generate bootstrap file for razor-server by visiting page
```
http://192.168.100.43:8150/api/microkernel/bootstrap
```

9. Set razor api endpoint on host machine
```
export RAZOR_API=http://192.168.100.43:8150/api
```


10. Start qemu in network boot
```
sudo qemu-system-x86_64 \
  -boot n \
  -m 2048 \
  -smp 2 \
  -nographic \
  -accel hax \
  -netdev tap,id=mynet0,script=qemu-ifup.sh,downscript=qemu-ifdown.sh \
  -device virtio-net,netdev=mynet0 \
  -device virtio-rng-pci
```
