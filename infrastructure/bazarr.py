import pulumi
from pulumi_kubernetes.apps.v1 import Deployment, DeploymentSpecArgs
from pulumi_kubernetes.core.v1 import (
    Service,
    EnvVarArgs,
    ContainerPortArgs,
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

app_name = "bazarr"
app_labels = {"app": app_name}

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
                        name="bazarr-config",
                        iscsi=ISCSIVolumeSourceArgs(
                            target_portal="172.16.0.1",
                            iqn="iqn.2022-01.hypervisor:bazarr",
                            lun=1,
                            fs_type="ext4",
                            read_only=False,
                        ),
                    ),
                    VolumeArgs(
                        name="bazarr-media",
                        nfs=NFSVolumeSourceArgs(
                            path="/data/media", server="172.16.0.1"
                        ),
                    ),
                ],
                "containers": [
                    {
                        "name": app_name,
                        "image": "linuxserver/bazarr",
                        "volume_mounts": [
                            VolumeMountArgs(
                                name="bazarr-config",
                                mount_path="/config",
                            ),
                            VolumeMountArgs(
                                name="bazarr-media",
                                mount_path="/tv",
                                sub_path="tv",
                            ),
                            VolumeMountArgs(
                                name="bazarr-media",
                                mount_path="/movies",
                                sub_path="movies",
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
                        "ports": [
                            ContainerPortArgs(
                                name="bazarr-ui",
                                container_port=6767,
                                protocol="TCP",
                            )
                        ],
                        "env": [
                            EnvVarArgs(name="PGID", value="0"),
                            EnvVarArgs(name="PUID", value="0"),
                            EnvVarArgs(name="TZ", value="Europe/Amsterdam"),
                        ],
                    }
                ],
            },
        },
    },
)

service = Service(
    app_name,
    metadata={
        "labels": deployment.spec["template"]["metadata"]["labels"],
    },
    spec={
        "type": "LoadBalancer",
        "ports": [{"port": 6767, "target_port": "bazarr-ui", "protocol": "TCP"}],
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
                host="bazarr",
                http=HTTPIngressRuleValueArgs(
                    paths=[
                        HTTPIngressPathArgs(
                            path="/",
                            path_type="Prefix",
                            backend=IngressBackendArgs(
                                service=IngressServiceBackendArgs(
                                    name=service.metadata.name,
                                    port=ServiceBackendPortArgs(
                                        number=6767,
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
