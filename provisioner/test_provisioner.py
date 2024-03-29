import yaml
import semver


def test_netplan_installed(host):
    netplan = host.package("netplan.io")
    assert netplan.is_installed


def test_netplan_config(host):
    with host.sudo():
        output = host.check_output("netplan get all")
        data = yaml.safe_load(output)
        assert data["network"]["ethernets"]["eth0"]["addresses"] == ["192.168.1.31/24"]


def test_ufw_installed(host):
    ufw = host.package("ufw")
    assert ufw.is_installed


def test_ufw_enabled(host):
    ufw = host.service("ufw")
    assert ufw.is_enabled


def test_hostname(host):
    assert host.check_output("hostname -s") == "provisioner"


def test_ubuntu_focal(host):
    assert host.system_info.type == "linux"
    assert host.system_info.distribution == "ubuntu"
    assert host.system_info.release == "22.04"
    assert host.system_info.codename == "jammy"


def test_user_added_to_sudo_group(host):
    assert "sudo" in host.user("ubuntu").groups


def test_docker_installed(host):
    docker = host.package("docker-ce")
    assert docker.is_installed


def test_docker_compose_installed(host):
    docker_compose = host.package("docker-compose-plugin")
    assert docker_compose.is_installed


def test_docker_service(host):
    docker = host.service("docker")
    assert docker.is_running
    assert docker.is_enabled


def test_user_added_to_docker_group(host):
    assert "docker" in host.user("ubuntu").groups


# def test_docker_system_prune_in_cron(host):
#     "0 0 * * * docker system prune -a -f --volumes" in host.check_output("crontab -l")


def test_newrelic_infra_installed(host):
    newrelic_infra = host.package("newrelic-infra")
    assert newrelic_infra.is_installed

    server_version = semver.VersionInfo.parse(newrelic_infra.version)
    wanted_version = semver.VersionInfo.parse("1.42.2")
    assert server_version >= wanted_version


def test_newrelic_infra_service(host):
    newrelic_infra = host.service("newrelic-infra")
    assert newrelic_infra.is_running
    assert newrelic_infra.is_enabled


def test_newrelic_infra_config(host):
    config = host.file("/etc/newrelic-infra.yml")
    assert config.exists
    assert config.contains("license_key:")
    assert "config validation finished without errors" in host.check_output(
        "newrelic-infra -validate"
    )


def test_github_exporter_service(host):
    github_exporter = host.docker("github_exporter")
    assert github_exporter.is_running


def test_nri_prometheus_service(host):
    nri_prometheus = host.docker("nri-prometheus")
    assert nri_prometheus.is_running


def test_nri_prometheus_config(host):
    with host.sudo():
        config = host.file("/opt/monitoring/nri-prometheus-config.yaml")
        assert config.exists
        assert config.contains("http://github_exporter:9504/metrics")
        assert config.contains("http://arm_exporter:9243/metrics")


def test_otel_collector_service(host):
    otel_collector = host.docker("otel-collector")
    assert otel_collector.is_running


def test_otel_collector_config(host):
    with host.sudo():
        config = host.file("/opt/monitoring/otel-collector-config.yaml")
        assert config.exists
        assert config.contains("https://otlp.eu01.nr-data.net:443")


def test_otel_collector_port_is_open(host):
    assert host.socket("tcp://127.0.0.1:4317").is_listening
    assert not host.socket("tcp://0.0.0.0:4317").is_listening

    assert host.socket("tcp://127.0.0.1:13133").is_listening
    assert not host.socket("tcp://0.0.0.0:13133").is_listening


def test_otel_collector_health(host):
    assert '"status":"Server available"' in host.check_output(
        "curl --fail -L http://localhost:13133"
    )


# def test_required_reboot_in_cron(host):
#     "0 1 * * * /opt/monitoring/reboot.sh" in host.check_output("crontab -l")


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


def test_teleport_health(host):
    assert '"status":"ok"' in host.check_output(
        "curl --fail -L http://localhost:3000/healthz"
    )


def test_https_port_is_open(host):
    assert host.socket("tcp://0.0.0.0:443").is_listening


def test_teleport_diag_port_is_open(host):
    assert host.socket("tcp://127.0.0.1:3000").is_listening
    assert not host.socket("tcp://0.0.0.0:3000").is_listening


def test_bunq2ynab_service(host):
    bunq2ynab = host.docker("bunq2ynab")
    assert bunq2ynab.is_running
