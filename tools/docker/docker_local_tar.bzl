load("@rules_oci//oci:defs.bzl", "oci_tarball")

def docker_local_tar(name, image, repo_tags, format = "docker"):
    tarball_name = "{}.oci_tarball".format(name)
    out_file = "{}.tar".format(name)

    oci_tarball(
        name = tarball_name,
        image = image,
        repo_tags = repo_tags,
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
        $$regctl image import ocidir://{name} $$tarball
        digest=$$($$regctl image digest --platform local ocidir://{name})
        export local_tarball=$@
        $$regctl image export ocidir://{name}@$$digest $$local_tarball
        """.format(
            tarball_name = tarball_name,
            name = name,
        ),
    )
    # task(
    #     name = name,
    #     cmds = [
    #         "$REGCTL image import ocidir://{} $TARBALL".format(name),
    #         "digest=$($REGCTL image digest --platform local ocidir://{})".format(name),
    #         "export LOCAL_TARBALL=$(pwd)/{}.tar".format(name),
    #         "$REGCTL image export ocidir://{}@$digest $LOCAL_TARBALL".format(name),
    #     ],
    #     env = {
    #         "TARBALL": cmd.file(tarball_name),
    #         "REGCTL": cmd.executable("@rules_release//tools/regctl"),
    #     },
    #     **kwargs
    # )

    # "$REGCTL image import ocidir://{} $TARBALL".format(binary_name),
    # "digest=$($REGCTL image digest --platform local ocidir://{})".format(binary_name),
    # "export LOCAL_TARBALL=$(pwd)/{}.tar".format(binary_name),
    # "$REGCTL image export ocidir://{}@$digest $LOCAL_TARBALL".format(binary_name),
