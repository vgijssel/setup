# configure rules_packer according to https://docs.bazel.build/versions/main/skylark/deploying.html#dependencies
# Help for writing repository rules:
# https://jayconrod.com/posts/110/writing-bazel-rules--repository-rules
# Specify dependencies necessary for rules_packer
# like minimal bazel version?

load(":packer_toolchain.bzl", "get_platform_info")

def rules_packer_dependencies():
    pass

def _packer_download_impl(rctx):
    rctx.report_progress("Downloading packer checksum")

    version = rctx.attr.version
    host_os = rctx.os.name
    host_cpu = rctx.os.arch
    platform_info = get_platform_info(os = host_os, cpu = host_cpu)

    rctx.download(
        "https://releases.hashicorp.com/packer/{version}/packer_{version}_SHA256SUMS".format(version = version),
        output = "checksums",
    )

    checksum_suffix = "packer_{version}_{os}_{cpu}.zip".format(version = version, os = platform_info.os, cpu = platform_info.cpu)
    checksum_data = rctx.read("checksums")
    checksum_lines = [line for line in checksum_data.splitlines() if line.endswith(checksum_suffix)]

    if len(checksum_lines) != 1:
        fail("Expected to find 1 checksum for {suffix}, found {count}".format(suffix = checksum_suffix, count = len(checksum_lines)))

    checksum = checksum_lines[0].split(" ")[0]

    rctx.report_progress("Downloading packer binary")

    # results in packer/packer binary
    rctx.download_and_extract(
        "https://releases.hashicorp.com/packer/{version}/packer_{version}_{os}_{cpu}.zip".format(version = version, os = platform_info.os, cpu = platform_info.cpu),
        output = "packer",
        sha256 = checksum,
    )

    template_label = Label("//tools/packer:BUILD.repositories.bazel")

    rctx.template(
        "BUILD.bazel",
        template_label,
        executable = False,
        substitutions = {
            "{host_os}": host_os,
            "{host_cpu}": host_cpu,
            "{rules_packer_repo_name}": template_label.workspace_name,
        },
    )

packer_download = repository_rule(
    implementation = _packer_download_impl,
    attrs = {
        "version": attr.string(),
    },
)

def rules_packer_toolchains(version):
    packer_download(name = "packer", version = version)
    native.register_toolchains("@packer//:all")
