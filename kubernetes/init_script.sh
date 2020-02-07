sudo kubeadm init --apiserver-advertise-address=$MASTER_IP --pod-network-cidr=10.244.0.0/16
echo $HOME;
echo $(id -u);
mkdir -p $HOME/.kube;
sudo cp -v -i /etc/kubernetes/admin.conf $HOME/.kube/config;
sudo chown $(id -u):$(id -g) $HOME/.kube/config;
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/2140ac876ef134e0ed5af15c65e414cf26827915/Documentation/kube-flannel.yml;
