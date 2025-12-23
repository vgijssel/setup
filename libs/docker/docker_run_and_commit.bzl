"""
For quickly loading and running docker images built by Bazel.
"""

load("@bazel_skylib//rules:write_file.bzl", "write_file")
load(":docker_local_tar.bzl", "docker_local_tar")

def docker_run_and_commit(name, cmd, image, format = "docker", timeout = 300):
    """Runs a command in a Docker container and exports the result.

    Args:
        name: Target name
        cmd: Command to run inside the container
        image: Base OCI image target
        format: Image format (default: "docker")
        timeout: Container timeout in seconds (default: 300)
    """
    local_tar_name = "{}.local_tar".format(name)
    script_name = "{}.script".format(name)
    script_file = "{}.sh".format(script_name)
    out_file = "{}.tar".format(name)
    tag = "{}:latest".format(name.replace("_", "-"))

    write_file(
        name = script_name,
        out = script_file,
        content = [
            "#!/usr/bin/env bash",
            "set -euo pipefail",
            cmd,
        ],
        is_executable = True,
    )

    docker_local_tar(
        name = local_tar_name,
        image = image,
        tag = name,
        format = format,
    )

    native.genrule(
        name = name,
        srcs = [script_name, local_tar_name],
        outs = [out_file],
        cmd = """
        script=$$(pwd)/$(location {script_name})
        local_tar=$(location {local_tar_name})
        docker load -i $$local_tar
        container_id=$$(docker run --rm -v $$script:/tmp/script.sh --detach --entrypoint="" localhost/{tag} sleep {timeout})
        docker exec $$container_id /tmp/script.sh
        docker export $$container_id --output $@
        docker rm -f $$container_id
        """.format(
            script_name = script_name,
            local_tar_name = local_tar_name,
            tag = tag,
            cmd = cmd,
            timeout = timeout,
        ),
        exec_properties = {
            "init-dockerd": "true",
            "recycle-runner": "true",
            "workload-isolation-type": "firecracker",
        },
    )
