# test if netplan is installed
import yaml


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

    cmd = host.run("ufw status")
    assert cmd.stdout.startswith("Status: active\n")


# test if cmdline is copied
# test cmd line arguments of os
# test if microk8s is installed
# test if uwf rules are applied for microk8s
# test if ubuntu user is added to microk8s group
# test if .kube directory is created and owned by ubuntu user
# test if microk8s is running
# test microk8s addons are enabled
def test_passwd_file(host):
    passwd = host.file("/etc/passwd")
    assert passwd.contains("root")
    assert passwd.user == "root"
    assert passwd.group == "root"
    assert passwd.mode == 0o644
