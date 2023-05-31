from pyinfra.api.deploy import deploy
from pyinfra.operations import files, server, apt, systemd
from pyinfra import host
from provisioner.utils import one_password_item
from pyinfra.facts.server import LsbRelease
from pyinfra.facts.deb import DebArch


@deploy("Install Monitoring")
def install_monitoring():
    files.directory(
        name="Ensure monitoring directory exists",
        path="/opt/monitoring",
        user="root",
        group="root",
        mode="700",
        _sudo=True,
    )

    new_relic_license_key = one_password_item("new_relic_license_key")["password"]
    github_exporter_token = one_password_item("github_exporter_token")["password"]

    docker_compose = files.template(
        name="Copy the docker-compose file",
        src="provisioner/deploys/monitoring/files/docker-compose.yml.j2",
        dest="/opt/monitoring/docker-compose.yml",
        mode="600",
        _sudo=True,
        user="root",
        group="root",
        github_exporter_token=github_exporter_token,
        new_relic_license_key=new_relic_license_key,
    )

    nri_prometheus_config = files.put(
        name="Copy New Relic config",
        src="provisioner/deploys/monitoring/files/nri-prometheus-config.yaml",
        dest="/opt/monitoring/nri-prometheus-config.yaml",
        _sudo=True,
        user="root",
        group="root",
        mode="0644",
    )

    if docker_compose.changed or nri_prometheus_config.changed:
        server.shell(
            name="Start the monitoring service",
            commands=[
                "docker compose -f /opt/monitoring/docker-compose.yml up -d --force-recreate",
            ],
            _sudo=True,
        )

    files.template(
        name="Copy New Relic config",
        src="provisioner/deploys/monitoring/files/newrelic-infra.yml.j2",
        dest="/etc/newrelic-infra.yml",
        create_remote_dir=True,
        _sudo=True,
        user="root",
        group="root",
        mode="0644",
        new_relic_license_key=new_relic_license_key,
        new_relic_display_name=host.data.new_relic_display_name,
        setup_env=host.data.setup_env,
    )

    lsb = host.get_fact(LsbRelease)
    version_codename = lsb["codename"]

    apt.packages(
        name="Install apt key requirements",
        packages=["curl", "gnupg"],
        _sudo=True,
    )

    server.shell(
        name="Add New Relic key",
        commands=[
            "curl -fsSL https://download.newrelic.com/infrastructure_agent/gpg/newrelic-infra.gpg | gpg --yes --dearmor -o /etc/apt/trusted.gpg.d/newrelic-infra.gpg",
        ],
        _sudo=True,
    )

    apt.repo(
        name="Install New Relic repo",
        src=f"deb https://download.newrelic.com/infrastructure_agent/linux/apt/ {version_codename} main",
        filename="newrelic-infra",
        _sudo=True,
    )

    apt.packages(
        name="Install New Relic",
        packages=["newrelic-infra"],
        update=True,
        present=True,
        cache_time=24 * 60 * 60,
        _sudo=True,
    )

    systemd.service(
        name="Enable the New Relic service",
        service="newrelic-infra.service",
        running=True,
        restarted=True,
        enabled=True,
        _sudo=True,
    )
