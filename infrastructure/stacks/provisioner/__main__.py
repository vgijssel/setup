import pulumi
import os
import pulumi_command as command
import pulumi_kubernetes as kubernetes
import yaml

config = pulumi.Config()
provisioner_host = config.require_secret("provisioner_host")
provisioner_port = config.require_secret("provisioner_port")
provisioner_ssh_key = config.require_secret("provisioner_ssh_key")


kubeconfig = command.remote.Command(
    "fetch-kubeconfig",
    connection={
        "host": provisioner_host,
        "user": "ubuntu",
        "privateKey": provisioner_ssh_key,
        "port": provisioner_port.apply(lambda x: float(x)),
    },
    create="microk8s config",
)

kubernetes_provider = kubernetes.Provider(
    "provisioner",
    kubeconfig=kubeconfig.stdout,
)

vault_ns = kubernetes.core.v1.Namespace(
    "vaultns",
    opts=pulumi.ResourceOptions(
        provider=kubernetes_provider,
    ),
)

vault = kubernetes.helm.v3.Release(
    "vault",
    chart="vault",
    namespace=vault_ns.metadata.name,
    repository_opts=kubernetes.helm.v3.RepositoryOptsArgs(
        repo="https://helm.releases.hashicorp.com",
    ),
    version="0.23.0",
    opts=pulumi.ResourceOptions(provider=kubernetes_provider),
)
