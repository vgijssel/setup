load("@aspect_bazel_lib//lib:tar.bzl", "mtree_spec", "tar")
load("@rules_oci//oci:defs.bzl", "oci_image", "oci_image_index")
load("@aspect_bazel_lib//lib:transitions.bzl", "platform_transition_filegroup")
load("//tools/docker:docker.bzl", "docker_load")

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
        binary_name = binary_name,
        image = image_index_name,
        exec_properties = {
            "workload-isolation-type": "firecracker",
            "init-dockerd": "true",
            "recycle-runner": "true",
        },
        format = "oci",
    )
