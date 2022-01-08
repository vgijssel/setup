import pulumi
from pulumi_kubernetes.apps.v1 import Deployment, DeploymentSpecArgs
from pulumi_kubernetes.core.v1 import (
    Service,
    EnvVarArgs,
    ContainerPortArgs,
    ServicePortArgs,
    VolumeMountArgs,
    VolumeArgs,
    NFSVolumeSourceArgs,
)
from pulumi_kubernetes.meta.v1 import LabelSelectorArgs, ObjectMetaArgs

app_name = "deluge"
app_labels = {"app": app_name}

container_ports = [
    ContainerPortArgs(
        name="deluge-ui",
        container_port=8112,
        protocol="TCP",
    ),
    ContainerPortArgs(
        name="deluge-in-tcp",
        container_port=6881,
        protocol="TCP",
    ),
    ContainerPortArgs(
        name="deluge-in-udp",
        container_port=6881,
        protocol="UDP",
    ),
]

service_ports_tcp = [
    ServicePortArgs(
        name=port.name,
        port=port.container_port,
        target_port=port.name,
        protocol=port.protocol,
    )
    for port in container_ports
    if port.protocol == "TCP"
]

service_ports_upd = [
    ServicePortArgs(
        name=port.name,
        port=port.container_port,
        target_port=port.name,
        protocol=port.protocol,
    )
    for port in container_ports
    if port.protocol == "UDP"
]

deployment = Deployment(
    app_name,
    spec={
        "selector": {"match_labels": app_labels},
        "replicas": 1,
        "template": {
            "metadata": {"labels": app_labels},
            "spec": {
                "volumes": [
                    VolumeArgs(
                        name="deluge-config",
                        nfs=NFSVolumeSourceArgs(
                            path="/data/apps/deluge", server="hypervisor"
                        ),
                    ),
                    VolumeArgs(
                        name="deluge-downloads",
                        nfs=NFSVolumeSourceArgs(
                            path="/data/downloads", server="hypervisor"
                        ),
                    ),
                ],
                "containers": [
                    {
                        "name": app_name,
                        "image": "linuxserver/deluge",
                        "volume_mounts": [
                            VolumeMountArgs(
                                name="deluge-config",
                                mount_path="/config",
                            ),
                            VolumeMountArgs(
                                name="deluge-downloads",
                                mount_path="/downloads",
                            ),
                        ],
                        "resources": {
                            "requests": {
                                "memory": "512Mi",
                            },
                            "limits": {
                                "memory": "512Mi",
                            },
                        },
                        "ports": container_ports,
                        "env": [
                            EnvVarArgs(name="PGID", value="0"),
                            EnvVarArgs(name="PUID", value="0"),
                            EnvVarArgs(name="TZ", value="Europe/Amsterdam"),
                            EnvVarArgs(name="DELUGE_LOGLEVEL", value="error"),
                        ],
                    }
                ],
            },
        },
    },
)

Service(
    f"{app_name}-tcp",
    metadata={
        "labels": deployment.spec["template"]["metadata"]["labels"],
    },
    spec={
        "type": "LoadBalancer",
        "ports": service_ports_tcp,
        "selector": app_labels,
    },
)

Service(
    f"{app_name}-udp",
    metadata={
        "labels": deployment.spec["template"]["metadata"]["labels"],
    },
    spec={
        "type": "LoadBalancer",
        "ports": service_ports_upd,
        "selector": app_labels,
    },
)
