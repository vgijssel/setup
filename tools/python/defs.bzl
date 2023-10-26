load("@aspect_bazel_lib//lib:tar.bzl", "mtree_spec", "tar")
load("@rules_oci//oci:defs.bzl", "oci_image", "oci_tarball")
load("@aspect_bazel_lib//lib:transitions.bzl", "platform_transition_binary")

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

def py_image(name, base, binary, target_platform, prefix = ""):
    binary_name = Label(binary).name
    transitioned_binary_name = "{}_transitioned".format(binary_name)
    entrypoint = ["/{}{}/{}".format(prefix, transitioned_binary_name, binary_name)]

    image_name = name
    image_python_layer_name = "{}_python_layer".format(name)
    tarball_name = "{}_tarball".format(name)

    repo_tags = [
        "{}:{}".format(binary_name, "latest"),
    ]

    # This transition is necessary otherwise on darwin the darwin hermetic Python interpreter
    # is copied into the Linux image which results in a exec format error.
    platform_transition_binary(
        name = transitioned_binary_name,
        basename = binary_name,
        binary = binary,
        target_platform = target_platform,
    )

    py_image_layer(
        name = image_python_layer_name,
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

    oci_tarball(
        name = tarball_name,
        image = image_name,
        repo_tags = repo_tags,
    )
