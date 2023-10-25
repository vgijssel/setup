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

# TODO: make this work!
def py_image(name, base, binary, prefix = "", target_platform = None):
    transitioned_binary = "{}_transitioned".format(name)

    platform_transition_binary(
        name = transitioned_binary,
        basename = "hello_world",
        binary = ":hello_world",
        target_platform = ":shine_platform",
    )

    py_image_layer(
        name = "hello_world_layer",
        binary = ":hello_world_transitioned",
        prefix = "opt/",
    )

    oci_image(
        name = "hello_world_image",
        base = "@python38_base_image//:image.tar.gz",
        entrypoint = ["/opt/hello_world_transitioned/hello_world"],
        tars = [
            ":hello_world_layer",
        ],
    )

    oci_tarball(
        name = "hello_world_tarball",
        image = ":hello_world_image",
        repo_tags = ["hello_world:latest"],
    )
