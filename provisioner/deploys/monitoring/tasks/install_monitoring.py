from pyinfra.api.deploy import deploy
from pyinfra.operations import files, server, apt, systemd
from pyinfra import host


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
        telegraf_env=host.data.setup_env,
    )

    files.template(
        name="Copy telegraf logz.io output config",
        src="provisioner/deploys/monitoring/files/logzio_output.conf.j2",
        dest="/etc/telegraf/telegraf.d/logzio_output.conf",
        create_remote_dir=True,
        _sudo=True,
        user="root",
        group="root",
        mode="0644",
        logzio_metrics_token="",
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
