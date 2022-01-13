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
    ISCSIVolumeSourceArgs,
)
from pulumi_kubernetes.meta.v1 import LabelSelectorArgs, ObjectMetaArgs
from pulumi_kubernetes.networking.v1 import (
    Ingress,
    IngressSpecArgs,
    IngressRuleArgs,
    HTTPIngressRuleValueArgs,
    HTTPIngressPathArgs,
    IngressBackendArgs,
    IngressServiceBackendArgs,
    ServiceBackendPortArgs,
)

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
                        iscsi=ISCSIVolumeSourceArgs(
                            target_portal="172.16.0.1",
                            iqn="iqn.2022-01.hypervisor:deluge",
                            lun=1,
                            fs_type="ext4",
                            read_only=False,
                        ),
                    ),
                    VolumeArgs(
                        name="deluge-downloads",
                        nfs=NFSVolumeSourceArgs(
                            path="/data/downloads", server="172.16.0.1"
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

service_tcp = Service(
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

service_udp = Service(
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

Ingress(
    app_name,
    metadata=ObjectMetaArgs(
        annotations={
            "kubernetes.io/ingress.class": "traefik",
        }
    ),
    spec=IngressSpecArgs(
        rules=[
            IngressRuleArgs(
                host="deluge",
                http=HTTPIngressRuleValueArgs(
                    paths=[
                        HTTPIngressPathArgs(
                            path="/",
                            path_type="Prefix",
                            backend=IngressBackendArgs(
                                service=IngressServiceBackendArgs(
                                    name=service_tcp.metadata.name,
                                    port=ServiceBackendPortArgs(
                                        number=8112,
                                    ),
                                ),
                            ),
                        )
                    ],
                ),
            )
        ],
    ),
)
