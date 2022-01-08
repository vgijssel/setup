import pulumi
from pulumi_kubernetes.apps.v1 import Deployment, DeploymentSpecArgs
from pulumi_kubernetes.core.v1 import (
    Service,
    EnvVarArgs,
    ContainerPortArgs,
    VolumeMountArgs,
    VolumeArgs,
    NFSVolumeSourceArgs,
)
from pulumi_kubernetes.meta.v1 import LabelSelectorArgs, ObjectMetaArgs

app_name = "sonarr"
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
                        name="sonarr-config",
                        nfs=NFSVolumeSourceArgs(
                            path="/data/apps/sonarr", server="hypervisor"
                        ),
                    ),
                    VolumeArgs(
                        name="sonarr-tv",
                        nfs=NFSVolumeSourceArgs(
                            path="/data/media", server="hypervisor"
                        ),
                    ),
                    VolumeArgs(
                        name="sonarr-downloads",
                        nfs=NFSVolumeSourceArgs(
                            path="/data/downloads", server="hypervisor"
                        ),
                    ),
                ],
                "containers": [
                    {
                        "name": app_name,
                        "image": "linuxserver/sonarr",
                        "volume_mounts": [
                            VolumeMountArgs(
                                name="sonarr-config",
                                mount_path="/config",
                            ),
                            VolumeMountArgs(
                                name="sonarr-tv",
                                mount_path="/tv",
                                sub_path="tv",
                            ),
                            VolumeMountArgs(
                                name="sonarr-downloads",
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
                                name="sonarr-ui",
                                container_port=8989,
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

Service(
    app_name,
    metadata={
        "labels": deployment.spec["template"]["metadata"]["labels"],
    },
    spec={
        "type": "LoadBalancer",
        "ports": [{"port": 8989, "target_port": "sonarr-ui", "protocol": "TCP"}],
        "selector": app_labels,
    },
)
