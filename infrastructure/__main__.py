"""A Kubernetes Python Pulumi program"""

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
                        nfs=NFSVolumeSourceArgs(
                            path="/data/apps/radarr", server="hypervisor"
                        ),
                    )
                ],
                "containers": [
                    {
                        "name": app_name,
                        "image": "linuxserver/radarr",
                        "volume_mounts": [
                            VolumeMountArgs(
                                name="radarr-config",
                                mount_path="/config",
                            )
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

frontend = Service(
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

ingress = frontend.status.apply(
    lambda v: v["load_balancer"]["ingress"][0] if "load_balancer" in v else None
)
if ingress is not None:
    result = ingress.apply(lambda v: v["ip"] if "ip" in v else v["hostname"])

pulumi.export("ip", result)
