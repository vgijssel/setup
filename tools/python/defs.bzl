load("@aspect_bazel_lib//lib:tar.bzl", "mtree_spec", "tar")
load("@rules_oci//oci:defs.bzl", "oci_image", "oci_image_index", "oci_tarball")
load("@aspect_bazel_lib//lib:transitions.bzl", "platform_transition_filegroup")
load("@rules_task//task:defs.bzl", "cmd", "task")
load("@local_config_platform//:constraints.bzl", "HOST_CONSTRAINTS")

def py_image_layer(name, binary, prefix = "", **kwargs):
    mtree_spec_name = "{}_mtree".format(name)
    prefixed_mtree_spec_name = "{}_prefixed".format(mtree_spec_name)

    mtree_spec(
        name = mtree_spec_name,
        srcs = [
            binary,
        ],
    )

    native.genrule(
        name = prefixed_mtree_spec_name,
        srcs = [mtree_spec_name],
        outs = ["{}.txt".format(prefixed_mtree_spec_name)],
        cmd = "sed 's|^|{}|' $< > $@".format(prefix),
    )

    tar(
        name = name,
        srcs = [binary],
        mtree = prefixed_mtree_spec_name,
    )

def py_image(name, base, binary, platforms, prefix = ""):
    binary_name = Label(binary).name
    package_name = native.package_name()
    entrypoint = ["/{}{}/{}".format(prefix, package_name, binary_name)]

    image_name = name
    image_load_name = "{}.load".format(name)
    image_python_layer_name = "{}_python_layer".format(name)
    image_index_name = "{}_index".format(name)
    tarball_name = "{}.tarball".format(image_index_name)

    repo_tags = [
        "{}:{}".format(binary_name, "latest"),
    ]

    py_image_layer(
        name = image_python_layer_name,
        binary = binary,
        prefix = prefix,
    )

    oci_image(
        name = image_name,
        base = base,
        entrypoint = entrypoint,
        tars = [
            image_python_layer_name,
        ],
    )

    transitioned_images = []

    for platform in platforms:
        platform_name = Label(platform).name
        transitioned_image = "{}_{}".format(image_name, platform_name)

        platform_transition_filegroup(
            name = transitioned_image,
            srcs = [image_name],
            target_platform = platform,
        )

        transitioned_images.append(transitioned_image)

    oci_image_index(
        name = image_index_name,
        images = transitioned_images,
    )

    oci_tarball(
        name = tarball_name,
        image = image_index_name,
        repo_tags = repo_tags,
        format = "oci",
    )

    # From https://stackoverflow.com/questions/72945407/how-do-i-import-and-run-a-multi-platform-oci-image-in-docker-for-macos
    # We need to load the multi-arch image using regctl
    # Export the platform specific digest into a tar
    # And load that tar into the daemon
    task(
        name = image_load_name,
        cmds = [
            "$REGCTL image import ocidir://{} $TARBALL".format(binary_name),
            "digest=$($REGCTL image digest --platform local ocidir://{})".format(binary_name),
            "export LOCAL_TARBALL=$TMPDIR/{}.tar".format(binary_name),
            "$REGCTL image export ocidir://{}@$digest $LOCAL_TARBALL".format(binary_name),
            "docker load < $LOCAL_TARBALL",
        ],
        env = {
            "TARBALL": cmd.file(tarball_name),
            "REGCTL": cmd.executable("//tools/regctl:regctl"),
        },
        exec_properties = {
            "workload-isolation-type": "firecracker",
            "init-dockerd": "true",
            "recycle-runner": "true",
        },
    )
