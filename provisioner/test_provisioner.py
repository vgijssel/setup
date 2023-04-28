import yaml
import re


def test_netplan_installed(host):
    netplan = host.package("netplan.io")
    assert netplan.is_installed


def test_netplan_config(host):
    cmd = host.run("netplan get all")
    data = yaml.safe_load(cmd.stdout)
    assert data["network"]["ethernets"]["eth0"]["addresses"] == ["192.168.1.31/24"]


def test_ufw_installed(host):
    ufw = host.package("ufw")
    assert ufw.is_installed


def test_ufw_enabled(host):
    ufw = host.service("ufw")
    assert ufw.is_enabled


def test_hostname(host):
    assert host.check_output("hostname -s") == "provisioner"


def test_cmdline(host):
    cmdline = host.file("/boot/firmware/cmdline.txt")
    assert cmdline.contains("root")
    assert cmdline.user == "root"
    assert cmdline.group == "root"
    assert cmdline.mode == 0o644


def test_ubuntu_focal(host):
    assert host.system_info.type == "linux"
    assert host.system_info.distribution == "ubuntu"
    assert host.system_info.release == "20.04"
    assert host.system_info.codename == "focal"


def test_microk8s_installed(host):
    assert "microk8s" in host.check_output("snap list")


def test_microk8s_version(host):
    assert host.check_output("microk8s version").startswith("MicroK8s v1.27")


def test_user_added_to_microk8s_group(host):
    assert "microk8s" in host.user("ubuntu").groups


def test_kube_config_permissions(host):
    kube_config = host.file("/home/ubuntu/.kube")
    assert kube_config.is_directory
    assert kube_config.user == "ubuntu"
    assert kube_config.group == "ubuntu"
    assert kube_config.mode == 0o755


def test_passwd_file(host):
    passwd = host.file("/etc/passwd")
    assert passwd.contains("root")
    assert passwd.user == "root"
    assert passwd.group == "root"
    assert passwd.mode == 0o644
