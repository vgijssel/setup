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

## Booting a diskimage-builder created ramdisk with pixiecore
1. Create the ramdisk
```
tox -e venv -- ramdisk-image-create -x -o ../images/deploy-image ramdisk debian hwburnin-new
```

2. Boot pixiecore
```
minikube start --vm-driver=vmware
eval $(minikube docker-env)

docker run \
  --rm \
  -it \
  --net=host \
  -v /mnt/hgfs/Users/maarten/Development/setup/kubernetes/images:/images \
  danderson/pixiecore \
    boot /images/deploy-image.kernel /images/deploy-image.initramfs
```

3. Boot vmware machine
