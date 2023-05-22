import yaml
import semver


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
    assert cmdline.mode == 0o755


def test_ubuntu_focal(host):
    assert host.system_info.type == "linux"
    assert host.system_info.distribution == "ubuntu"
    assert host.system_info.release == "22.04"
    assert host.system_info.codename == "jammy"


def test_telegraf_installed(host):
    telegraf = host.package("telegraf")
    assert telegraf.is_installed


def test_telegraf_service(host):
    telegraf = host.service("telegraf")
    assert telegraf.is_enabled
    assert telegraf.is_running


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


def test_wget_installed(host):
    wget = host.package("wget")
    assert wget.is_installed


def test_teleport_installed(host):
    teleport = host.package("teleport")
    assert teleport.is_installed

    server_version = semver.VersionInfo.parse(teleport.version)
    wanted_version = semver.VersionInfo.parse("12.3.1")
    assert server_version >= wanted_version


def test_teleport_service(host):
    teleport = host.service("teleport")
    assert teleport.is_running
    assert teleport.is_enabled


def test_https_port_is_open(host):
    assert host.socket("tcp://0.0.0.0:443").is_listening


def test_teleport_diag_port_is_open(host):
    assert host.socket("tcp://127.0.0.1:3000").is_listening
