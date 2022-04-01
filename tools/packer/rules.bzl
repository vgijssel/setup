def _bar_binary_impl(ctx):
    # ...
    info = ctx.toolchains["//tools/packer:toolchain_type"].barcinfo

    command = "%s -l %s %s" % (
        info.compiler_path,
        info.system_lib,
        " ".join(info.arch_flags),
    )
    # ...

bar_binary = rule(
    implementation = _bar_binary_impl,
    attrs = {
        "srcs": attr.label_list(allow_files = True),
    },
    toolchains = ["//tools/packer:toolchain_type"],
)
