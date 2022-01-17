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
    Secret,
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

from pulumi_kubernetes.batch.v1beta1 import CronJob

from onepassword import get_secret

secret_data = get_secret("documents-home-rig")

secret = Secret(
    "rclone-documents",
    type="Opaque",
    string_data={
        "key_id": secret_data["username"],
        "application_key": secret_data["password"],
    },
)

CronJob(
    "backup-documents",
    metadata={
        "name": "backup-documents",
    },
    spec={
        # Run the cronjob every hour
        "schedule": "@hourly",
        "concurrency_policy": "Forbid",
        "job_template": {
            "spec": {
                "template": {
                    "spec": {
                        "volumes": [
                            VolumeArgs(
                                name="rclone-docs",
                                nfs=NFSVolumeSourceArgs(
                                    path="/data/docs", server="172.16.0.1"
                                ),
                            ),
                        ],
                        "containers": [
                            {
                                "name": "backup-documents",
                                "image": "rclone/rclone:latest",
                                "env": [
                                    EnvVarArgs(
                                        name="B2_ACCOUNT",
                                        value_from={
                                            "secret_key_ref": {
                                                "name": secret.metadata.name,
                                                "key": "key_id",
                                            }
                                        },
                                    ),
                                    EnvVarArgs(
                                        name="B2_KEY",
                                        value_from={
                                            "secret_key_ref": {
                                                "name": secret.metadata.name,
                                                "key": "application_key",
                                            }
                                        },
                                    ),
                                ],
                                "command": [
                                    "rclone",
                                    "sync",
                                    "--b2-account",
                                    "$(B2_ACCOUNT)",
                                    "--b2-key",
                                    "$(B2_KEY)",
                                    "-P",
                                    "/docs",
                                    ":b2:documents-home-rig",
                                ],
                                "volume_mounts": [
                                    VolumeMountArgs(
                                        name="rclone-docs",
                                        mount_path="/docs",
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
                            }
                        ],
                        "restart_policy": "OnFailure",
                    }
                }
            }
        },
    },
)
