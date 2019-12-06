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


Commands

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

