load("@aspect_bazel_lib//lib:tar.bzl", "mtree_spec", "tar")
load("@rules_oci//oci:defs.bzl", "oci_image", "oci_tarball")
load("@aspect_bazel_lib//lib:transitions.bzl", "platform_transition_binary")
load("@aspect_bazel_lib//lib:transitions.bzl", "platform_transition_filegroup")
load("@rules_task//:defs.bzl", "cmd", "task")

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

def py_image(name, base, binary, host_container_platform, prefix = ""):
    binary_name = Label(binary).name
    transitioned_binary_name = "{}_transitioned".format(binary_name)
    package_name = native.package_name()
    entrypoint = ["/{}{}/{}".format(prefix, package_name, binary_name)]

    image_name = name
    transitioned_image = "{}_transitioned".format(name)
    image_load_name = "{}.load".format(name)
    image_python_layer_name = "{}_python_layer".format(name)
    tarball_name = "{}.tarball".format(transitioned_image)

    repo_tags = [
        "{}:{}".format(binary_name, "latest"),
    ]

    platform_transition_binary(
        name = transitioned_binary_name,
        binary = binary,
        # target_platform = host_container_platform,
        target_platform = "//tools/python:python_container",
    )

    py_image_layer(
        name = image_python_layer_name,
        # binary = binary,
        binary = transitioned_binary_name,
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

    platform_transition_filegroup(
        name = transitioned_image,
        srcs = [image_name],
        # target_platform = host_container_platform,
        target_platform = "//tools/python:python_container",
    )

    oci_tarball(
        name = tarball_name,
        # image = transitioned_image,
        image = image_name,
        repo_tags = repo_tags,
    )

    task(
        name = image_load_name,
        cmds = [
            "docker load < $TARBALL",
        ],
        env = {
            "TARBALL": cmd.file(tarball_name),
        },
        exec_properties = {
            "workload-isolation-type": "firecracker",
            "init-dockerd": "true",
            "recycle-runner": "true",
        },
    )
