"""
For quickly loading and running docker images built by Bazel.
"""

load("@rules_task//task:defs.bzl", "cmd", "task")
load(":docker_local_tar.bzl", "docker_local_tar")

def docker_load(name, binary_name, image, format = "docker", **kwargs):
    local_tar_name = "{}.local_tar".format(name)
    repo_tags = [
        "{}:{}".format(binary_name, "latest"),
    ]

    docker_local_tar(
        name = local_tar_name,
        image = image,
        repo_tags = repo_tags,
        format = format,
    )

    # From https://stackoverflow.com/questions/72945407/how-do-i-import-and-run-a-multi-platform-oci-image-in-docker-for-macos
    # We need to load the multi-arch image using regctl
    # Export the platform specific digest into a tar
    # And load that tar into the daemon
    task(
        name = name,
        cmds = [
            "docker load < $LOCAL_TARBALL 1>&2",
            "echo localhost/{}:latest".format(binary_name),
        ],
        env = {
            "LOCAL_TAR": cmd.file(local_tar_name),
            "REGCTL": cmd.executable("@rules_release//tools/regctl"),
        },
        **kwargs
    )
