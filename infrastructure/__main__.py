# import deluge
# import jackett
# import radarr
# import sonarr
# import bazarr
# import plex
# import rclone

# import debugpy
# debugpy.listen(("0.0.0.0", 5678))
# pulumi.info("debugpy is listening, attach by pressing F5 or ►")
# debugpy.wait_for_client()
# pulumi.info("Attached to debugpy!")

import os
from rules_python.python.runfiles import runfiles
import vagrant
import pulumi
from pulumi_command import remote

r = runfiles.Create()
vagrantfile_dir = os.path.join(
    os.path.dirname(r.Rlocation("setup/hypervisor/.kitchen/.gitignore")),
    "kitchen-vagrant",
    "default-ubuntu-focal",
)

v = vagrant.Vagrant(vagrantfile_dir, quiet_stdout=False, quiet_stderr=False)

private_key = open(v.keyfile(), "r").read()
connection = remote.ConnectionArgs(
    host=v.hostname(),
    port=int(v.port()),
    private_key=private_key,
    user=v.user(),
)

ignite_create_vm_script = """
sudo ignite run weaveworks/ignite-ubuntu --cpus 1 --memory 1GB --ssh --name my-vm
"""

ignite_delete_vm_script = """
sudo ignite rm -f my-vm || true
"""

ignite_vm = remote.Command(
    "ignite_vm",
    connection=connection,
    create=ignite_create_vm_script,
    delete=ignite_delete_vm_script,
    opts=pulumi.ResourceOptions(delete_before_replace=True),
    triggers=[ignite_create_vm_script, ignite_delete_vm_script],
)

ignite_vm_logs_script = """
sudo ignite logs my-vm
"""

ignite_vm_logs = remote.Command(
    "ignite_vm_logs",
    connection=connection,
    create=ignite_vm_logs_script,
    triggers=[ignite_vm_logs_script, ignite_vm],
    opts=pulumi.ResourceOptions(depends_on=[ignite_vm]),
)

pulumi.export("ignite_vm_logs", ignite_vm_logs.stdout)

# create_script = """
# sudo kubefire install;
# sudo kubefire cluster create -f demo --master-cpu 1 -b k3s;
# """

# # sudo kubefire cluster show demo -o json | jq -r ".Nodes[0].Status.IPAddresses"

# delete_script = """
# sudo kubefire cluster delete -f demo
# """

# k3s_cluster = remote.Command(
#     "k3s_cluster",
#     connection=connection,
#     create=create_script,
#     delete=delete_script,
#     opts=pulumi.ResourceOptions(delete_before_replace=True),
#     triggers=[create_script, delete_script],
# )

# kubeconfig_script = """
# sudo kubefire kubeconfig show demo
# """

# k3s_kubeconfig = remote.Command(
#     "k3s_kubeconfig",
#     connection=connection,
#     create=kubeconfig_script,
#     triggers=[k3s_cluster, kubeconfig_script],
#     opts=pulumi.ResourceOptions(depends_on=[k3s_cluster]),
# )

# pulumi.export("kubeconfig", k3s_kubeconfig.stdout)


# , {
#     connection,
#     create: interpolate`echo ${server.privateIp} > private_ip.txt`,
#     delete: `rm private_ip.txt`,
# }, { deleteBeforeReplace: true });
# def ignite_vm(name, template_file, connection):
#     template_file_path = r.Rlocation(template_file)
#     template_file_content =  open(template_file_path, 'r').read()
#     remote_path = os.path.join("/etc/firecracker/manifests", os.path.basename(template_file_path))

#     remote.CopyFile(
#         name,
#         connection=connection,
#         local_path=template_file_path,
#         remote_path=remote_path,
#         triggers=[template_file_content]
#     )


# ignite_vm(
#     "control-plane",
#     template_file="setup/infrastructure/k8s-control-plane.yaml",
#     connection = connection,
# )

# ignite_vm(
#     "worker",
#     template_file="setup/infrastructure/k8s-worker.yaml",
#     connection = connection,
# )
