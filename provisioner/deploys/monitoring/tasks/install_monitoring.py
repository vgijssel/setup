from pyinfra.api.deploy import deploy
from pyinfra.operations import files, server, apt, systemd
from pyinfra import host
from provisioner.utils import one_password_item
from pyinfra.facts.server import LsbRelease
from pyinfra.facts.deb import DebArch


@deploy("Install Monitoring")
def install_monitoring():
    apt.packages(
        name="Install telegraf",
        packages=["telegraf"],
        _sudo=True,
    )

    files.template(
        name="Copy telegraf config",
        src="provisioner/deploys/monitoring/files/telegraf.conf.j2",
        dest="/etc/telegraf/telegraf.conf",
        create_remote_dir=True,
        _sudo=True,
        user="root",
        group="root",
        mode="0644",  # rw r r for root
        setup_env=host.data.setup_env,
    )

    logzio_metrics_token = one_password_item("logzio_metrics_token")["password"]

    files.template(
        name="Copy telegraf logz.io output config",
        src="provisioner/deploys/monitoring/files/logzio_output.conf.j2",
        dest="/etc/telegraf/telegraf.d/logzio_output.conf",
        create_remote_dir=True,
        _sudo=True,
        user="root",
        group="root",
        mode="0644",
        logzio_metrics_token=logzio_metrics_token,
    )

    files.put(
        name="Copy telegraf json file output config",
        src="provisioner/deploys/monitoring/files/json_file_output.conf",
        dest="/etc/telegraf/telegraf.d/json_file_output.conf",
        create_remote_dir=True,
        _sudo=True,
        user="root",
        group="root",
        mode="0644",
    )

    systemd.service(
        name="Enable the telegraf service",
        service="telegraf.service",
        running=True,
        restarted=True,
        enabled=True,
        _sudo=True,
    )

    new_relic_license_key = one_password_item("new_relic_license_key")["password"]

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
            "curl -fsSL https://download.newrelic.com/infrastructure_agent/gpg/newrelic-infra.gpg | gpg --dearmor -o /etc/apt/trusted.gpg.d/newrelic-infra.gpg",
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
