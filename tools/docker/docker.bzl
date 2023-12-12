"""
For quickly loading and running docker images built by Bazel.
"""

load("@rules_task//task:defs.bzl", "cmd", "task")
load("@rules_oci//oci:defs.bzl", "oci_image", "oci_tarball")

def docker_load(name, binary_name, image, format = "docker", **kwargs):
    tarball_name = "{}.tarball".format(name)
    image_name = "{}.image".format(name)

    repo_tags = [
        "{}:{}".format(binary_name, "latest"),
    ]

    oci_image(
        name = image_name,
        base = image,
    )

    oci_tarball(
        name = tarball_name,
        image = image_name,
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
            "$REGCTL image import ocidir://{} $TARBALL".format(binary_name),
            "digest=$($REGCTL image digest --platform local ocidir://{})".format(binary_name),
            "export LOCAL_TARBALL=$(pwd)/{}.tar".format(binary_name),
            "$REGCTL image export ocidir://{}@$digest $LOCAL_TARBALL".format(binary_name),
            {"defer": "rm -f $LOCAL_TARBALL"},
            "docker load < $LOCAL_TARBALL 1>&2",
            "echo localhost/{}:latest".format(binary_name),
        ],
        env = {
            "TARBALL": cmd.file(tarball_name),
            "REGCTL": cmd.executable("@rules_release//tools/regctl"),
        },
        **kwargs
    )
