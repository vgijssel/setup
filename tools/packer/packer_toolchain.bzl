"""
Bazel repository rule to setup the packer toolchain.
"""

PackerInfo = provider(
    doc = "Information about packer runtime",
    fields = {
        "packer_binary": "A label which points to the packer binary",
    },
)

def _packer_toolchain_impl(ctx):
    toolchain_info = platform_common.ToolchainInfo(
        packer_info = PackerInfo(
            packer_binary = ctx.attr.packer_binary,
        ),
    )
    return [toolchain_info]

_packer_toolchain = rule(
    implementation = _packer_toolchain_impl,
    attrs = {
        "packer_binary": attr.label(
            mandatory = True,
            allow_files = True,
            executable = True,
            cfg = "exec",
        ),
    },
)

CPU_MAPPING = {
    "x86_64": "amd64",
}

CPU_CONSTRAINT_MAPPING = {
}

OS_MAPPING = {
    "mac os x": "darwin",
}

OS_CONSTRAINT_MAPPING = {
    "mac os x": "macos",
}

def get_platform_info(os, cpu):
    return struct(
        os = OS_MAPPING.get(os, os),
        os_constraint = "@platforms//os:{os_constraint}"
            .format(os_constraint = OS_CONSTRAINT_MAPPING.get(os, os)),
        cpu = CPU_MAPPING.get(cpu, cpu),
        cpu_constraint = "@platforms//cpu:{cpu_constraint}"
            .format(cpu_constraint = CPU_CONSTRAINT_MAPPING.get(cpu, cpu)),
    )

def packer_toolchain(name, host_os, host_cpu, packer_binary):
    platform_info = get_platform_info(os = host_os, cpu = host_cpu)

    _packer_toolchain(
        name = "packer_{os}_{cpu}".format(os = platform_info.os, cpu = platform_info.cpu),
        packer_binary = packer_binary,
    )

    native.toolchain(
        name = "packer_{os}_{cpu}_toolchain".format(os = platform_info.os, cpu = platform_info.cpu),
        exec_compatible_with = [
            platform_info.os_constraint,
            platform_info.cpu_constraint,
        ],
        # target_compatible_with can be empty because
        # packer can build for any platform!
        target_compatible_with = [],
        toolchain = ":packer_{os}_{cpu}".format(os = platform_info.os, cpu = platform_info.cpu),
        toolchain_type = "@//tools/packer:toolchain_type",
    )
