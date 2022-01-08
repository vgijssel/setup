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

app_name = "jackett"
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
                        name="jackett-config",
                        nfs=NFSVolumeSourceArgs(
                            path="/data/apps/jackett", server="hypervisor"
                        ),
                    ),
                    VolumeArgs(
                        name="jackett-downloads",
                        nfs=NFSVolumeSourceArgs(
                            path="/data/downloads", server="hypervisor"
                        ),
                    ),
                ],
                "containers": [
                    {
                        "name": app_name,
                        "image": "linuxserver/jackett",
                        "volume_mounts": [
                            VolumeMountArgs(
                                name="jackett-config",
                                mount_path="/config",
                            ),
                            VolumeMountArgs(
                                name="jackett-downloads",
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
                        "ports": [
                            ContainerPortArgs(
                                name="jackett-ui",
                                container_port=9117,
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
        "ports": [{"port": 9117, "target_port": "jackett-ui", "protocol": "TCP"}],
        "selector": app_labels,
    },
)
