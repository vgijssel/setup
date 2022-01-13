# NOTE: first time setup requires accessing plex on localhost
# we can use the kubectl port-forward for this:
# kubectl port-forward <<plex pod name>> 32400

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

app_name = "plex"
app_labels = {"app": app_name}

container_ports = [
    ContainerPortArgs(
        name="plex-ui",
        container_port=32400,
        protocol="TCP",
    ),
    ContainerPortArgs(
        name="plex-tcp1",
        container_port=3005,
        protocol="TCP",
    ),
    ContainerPortArgs(
        name="plex-tcp2",
        container_port=8324,
        protocol="TCP",
    ),
    ContainerPortArgs(
        name="plex-tcp3",
        container_port=32469,
        protocol="TCP",
    ),
    ContainerPortArgs(
        name="plex-udp1",
        container_port=1900,
        protocol="UDP",
    ),
    ContainerPortArgs(
        name="plex-udp2",
        container_port=32410,
        protocol="UDP",
    ),
    ContainerPortArgs(
        name="plex-udp3",
        container_port=32412,
        protocol="UDP",
    ),
    ContainerPortArgs(
        name="plex-udp4",
        container_port=32413,
        protocol="UDP",
    ),
    ContainerPortArgs(
        name="plex-udp5",
        container_port=32414,
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
                        name="plex-config",
                        iscsi=ISCSIVolumeSourceArgs(
                            target_portal="172.16.0.1",
                            iqn="iqn.2022-01.hypervisor:plex",
                            lun=1,
                            fs_type="ext4",
                            read_only=False,
                        ),
                    ),
                    VolumeArgs(
                        name="plex-data",
                        nfs=NFSVolumeSourceArgs(
                            path="/data/media", server="172.16.0.1"
                        ),
                    ),
                ],
                "containers": [
                    {
                        "name": app_name,
                        "image": "plexinc/pms-docker",
                        "volume_mounts": [
                            VolumeMountArgs(
                                name="plex-config",
                                mount_path="/config",
                            ),
                            VolumeMountArgs(
                                name="plex-data",
                                mount_path="/data",
                            ),
                        ],
                        "resources": {
                            "requests": {
                                "memory": "1Gi",
                            },
                            "limits": {
                                "memory": "2Gi",
                            },
                        },
                        "ports": container_ports,
                        "env": [
                            EnvVarArgs(name="PLEX_UID", value="0"),
                            EnvVarArgs(name="PLEX_GID", value="0"),
                            EnvVarArgs(name="TZ", value="Europe/Amsterdam"),
                            EnvVarArgs(
                                name="ADVERTISE_IP", value="http://192.168.1.20:32400"
                            ),
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
        "load_balancer_ip": "192.168.1.20",
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
        "load_balancer_ip": "192.168.1.20",
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
                host="plex",
                http=HTTPIngressRuleValueArgs(
                    paths=[
                        HTTPIngressPathArgs(
                            path="/",
                            path_type="Prefix",
                            backend=IngressBackendArgs(
                                service=IngressServiceBackendArgs(
                                    name=service_tcp.metadata.name,
                                    port=ServiceBackendPortArgs(
                                        number=32400,
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
