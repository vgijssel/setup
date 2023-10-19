load("@aspect_bazel_lib//lib:tar.bzl", "mtree_spec", "tar")

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
        outs = ["output.txt"],
        cmd = "sed 's|^|{}|' $< > $@".format(prefix),
    )

    tar(
        name = name,
        srcs = [binary],
        mtree = prefixed_mtree_spec_name,
    )
