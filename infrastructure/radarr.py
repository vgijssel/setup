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

app_name = "radarr"
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
                        name="radarr-config",
                        iscsi=ISCSIVolumeSourceArgs(
                            target_portal="172.16.0.1",
                            iqn="iqn.2022-01.hypervisor:radarr",
                            lun=1,
                            fs_type="ext4",
                            read_only=False,
                        ),
                    ),
                    VolumeArgs(
                        name="radarr-movies",
                        nfs=NFSVolumeSourceArgs(
                            path="/data/media", server="172.16.0.1"
                        ),
                    ),
                    VolumeArgs(
                        name="radarr-downloads",
                        nfs=NFSVolumeSourceArgs(
                            path="/data/downloads", server="172.16.0.1"
                        ),
                    ),
                ],
                "containers": [
                    {
                        "name": app_name,
                        "image": "linuxserver/radarr",
                        "volume_mounts": [
                            VolumeMountArgs(
                                name="radarr-config",
                                mount_path="/config",
                            ),
                            VolumeMountArgs(
                                name="radarr-movies",
                                mount_path="/movies",
                                sub_path="movies",
                            ),
                            VolumeMountArgs(
                                name="radarr-downloads",
                                mount_path="/downloads",
                            ),
                        ],
                        "resources": {
                            "requests": {
                                "memory": "512Mi",
                            },
                            "limits": {
                                "memory": "1Gi",
                            },
                        },
                        "ports": [
                            ContainerPortArgs(
                                name="radarr-ui",
                                container_port=7878,
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
        "ports": [{"port": 7878, "target_port": 7878, "protocol": "TCP"}],
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
                host="radarr",
                http=HTTPIngressRuleValueArgs(
                    paths=[
                        HTTPIngressPathArgs(
                            path="/",
                            path_type="Prefix",
                            backend=IngressBackendArgs(
                                service=IngressServiceBackendArgs(
                                    name=service.metadata.name,
                                    port=ServiceBackendPortArgs(
                                        number=7878,
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
