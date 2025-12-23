"""Rules for loading multi-arch OCI images into Docker."""

load("@rules_oci//oci:defs.bzl", "oci_tarball")

def docker_local_tar(name, image, tag, format = "docker"):
    """Exports a platform-specific OCI image to a tar file for Docker.

    From https://stackoverflow.com/questions/72945407/how-do-i-import-and-run-a-multi-platform-oci-image-in-docker-for-macos
    We need to load the multi-arch image using regctl, export the platform
    specific digest into a tar, and load that tar into the daemon.

    Args:
        name: Target name
        image: OCI image target
        tag: Image tag for the tarball
        format: Image format (default: "docker")
    """
    tarball_name = "{}.oci_tarball".format(name)
    out_file = "{}.tar".format(name)

    oci_tarball(
        name = tarball_name,
        image = image,
        repo_tags = [tag],
        format = format,
    )

    native.genrule(
        name = name,
        srcs = [
            tarball_name,
        ],
        outs = [
            out_file,
        ],
        tools = [
            "@rules_release//tools/regctl",
        ],
        cmd = """
        regctl=$(location @rules_release//tools/regctl)
        tarball=$(location {tarball_name})
        $$regctl image import ocidir://{tag} $$tarball
        digest=$$($$regctl image digest --platform local ocidir://{tag})
        export local_tarball=$@
        $$regctl image export ocidir://{tag}@$$digest $$local_tarball
        """.format(
            tarball_name = tarball_name,
            tag = tag,
        ),
        exec_properties = {
            "init-dockerd": "true",
            "recycle-runner": "true",
            "workload-isolation-type": "firecracker",
        },
    )
