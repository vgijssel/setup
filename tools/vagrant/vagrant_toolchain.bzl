VagrantToolchainInfo = provider(
    doc = "Vagrant toolchain rule parameters",
    fields = {
        "binary_path": "Path to the Vagrant binary",
    },
)

def _vagrant_toolchain_impl(ctx):
    toolchain_info = platform_common.ToolchainInfo(
        vagrant_toolchain_info = VagrantToolchainInfo(
            binary_path = ctx.attr.binary_path,
        ),
    )

    toolchain_variables = platform_common.TemplateVariableInfo({
        "VAGRANT_BINARY_PATH": ctx.attr.binary_path,
    })

    return [toolchain_info, toolchain_variables]

_vagrant_toolchain = rule(
    implementation = _vagrant_toolchain_impl,
    attrs = {
        "binary_path": attr.string(mandatory = True),
    },
)

def vagrant_toolchain(name, binary_path):
    _vagrant_toolchain(
        name = name,
        binary_path = binary_path,
    )

    native.toolchain(
        name = "default_windows_toolchain",
        target_compatible_with = [
            "@platforms//os:windows",
        ],
        toolchain = name,
        toolchain_type = ":toolchain_type",
    )

    native.toolchain(
        name = "default_linux_toolchain",
        target_compatible_with = [
            "@platforms//os:linux",
        ],
        toolchain = name,
        toolchain_type = ":toolchain_type",
    )

    native.toolchain(
        name = "default_osx_toolchain",
        target_compatible_with = [
            "@platforms//os:osx",
        ],
        toolchain = name,
        toolchain_type = ":toolchain_type",
    )
