"""Python OCI image build helpers."""

load("@aspect_bazel_lib//lib:tar.bzl", "mtree_spec", "tar")
load("@aspect_bazel_lib//lib:transitions.bzl", "platform_transition_filegroup")
load("@rules_oci//oci:defs.bzl", "oci_image", "oci_image_index")
load("//tools/docker:docker_load.bzl", "docker_load")

def py_image_layer(name, binary, prefix = ""):
    """Creates a tar layer from a Python binary for OCI images.

    Args:
        name: Target name
        binary: Python binary target
        prefix: Path prefix for the layer contents (default: "")
    """
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

def py_image(name, base, binary, platforms, prefix = "", labels = None):
    """Builds a multi-platform OCI image from a Python binary.

    Args:
        name: Target name
        base: Base OCI image target
        binary: Python binary target
        platforms: List of platform targets for multi-arch builds
        prefix: Path prefix for binary in the image (default: "")
        labels: Optional dict of OCI image labels
    """
    binary_name = Label(binary).name
    package_name = native.package_name()
    entrypoint = ["/{}{}/{}".format(prefix, package_name, binary_name)]

    image_index_name = name
    image_name = "{}.image".format(image_index_name)
    image_load_name = "{}.load".format(image_index_name)
    image_python_layer_name = "{}_python_layer".format(image_index_name)

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
        labels = labels,
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

    docker_load(
        name = image_load_name,
        tag = "{}:latest".format(binary_name),
        image = image_index_name,
        format = "oci",
    )
