from pyinfra.api.deploy import deploy
from pyinfra.operations import files, server, apt, systemd
from pyinfra import host
from tools.onepassword.lib import get_item_path
from pyinfra.facts.server import LsbRelease
from pyinfra.facts.deb import DebArch


@deploy("Install Monitoring")
def install_monitoring():
    files.directory(
        name="Ensure monitoring directory exists",
        path="/opt/monitoring",
        user="root",
        group="root",
        mode="0700",
        _sudo=True,
    )

    new_relic_license_key = get_item_path("new_relic_license_key.password")
    github_exporter_token = get_item_path("github_exporter_token.password")

    docker_compose = files.template(
        name="Copy the docker-compose file",
        src="provisioner/deploys/monitoring/files/docker-compose.yml.j2",
        dest="/opt/monitoring/docker-compose.yml",
        mode="0600",
        _sudo=True,
        user="root",
        group="root",
        github_exporter_token=github_exporter_token,
        new_relic_license_key=new_relic_license_key,
        setup_env=host.data.setup_env,
        is_arm=host.get_fact(DebArch) == "arm64",
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

    otel_collector_config = files.put(
        name="Copy Oopen Telemetry config",
        src="provisioner/deploys/monitoring/files/otel-collector-config.yaml",
        dest="/opt/monitoring/otel-collector-config.yaml",
        _sudo=True,
        user="root",
        group="root",
        mode="0644",
    )

    if (
        docker_compose.changed
        or nri_prometheus_config.changed
        or otel_collector_config.changed
    ):
        server.shell(
            name="Start the monitoring service",
            commands=[
                "docker compose -f /opt/monitoring/docker-compose.yml up -d --force-recreate --remove-orphans",
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

    add_apt_repo = apt.repo(
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
        cache_time=0 if add_apt_repo.changed else 24 * 60 * 60,
        _sudo=True,
    )

    files.put(
        name="Copy New Relic logging config",
        src="provisioner/deploys/monitoring/files/logging.yml",
        dest="/etc/newrelic-infra/logging.d/logging.yml",
        _sudo=True,
        user="root",
        group="root",
        mode="0644",
    )

    files.put(
        name="Copy New Relic docker fluentbit logging config",
        src="provisioner/deploys/monitoring/files/docker-logs-fluentbit.conf",
        dest="/etc/newrelic-infra/logging.d/docker-logs-fluentbit.conf",
        _sudo=True,
        user="root",
        group="root",
        mode="0644",
    )

    files.put(
        name="Copy New Relic docker fluentbit parser",
        src="provisioner/deploys/monitoring/files/docker-parser-fluentbit.conf",
        dest="/etc/newrelic-infra/logging.d/docker-parser-fluentbit.conf",
        _sudo=True,
        user="root",
        group="root",
        mode="0644",
    )

    systemd.service(
        name="Enable the New Relic service",
        service="newrelic-infra.service",
        running=True,
        restarted=True,
        enabled=True,
        _sudo=True,
    )

    apt.packages(
        name="Install cron",
        packages=["cron"],
        update=True,
        cache_time=24 * 60 * 60,
        _sudo=True,
    )

    files.put(
        name="Copy reboot script",
        src="provisioner/deploys/monitoring/files/reboot.sh",
        dest="/opt/monitoring/reboot.sh",
        _sudo=True,
        user="root",
        group="root",
        mode="0744",
    )

    server.crontab(
        name="Reboot at 01:00 when required",
        command="/opt/monitoring/reboot.sh",
        minute="0",
        hour="1",
        _sudo=True,
    )
