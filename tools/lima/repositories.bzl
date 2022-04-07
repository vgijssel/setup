load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
# load(":lima_toolchain.bzl", "get_platform_info")

# def rules_lima_dependencies():
#     pass

# def _lima_download_impl(rctx):
#     rctx.report_progress("Downloading lima checksum")

#     version = rctx.attr.version
#     host_os = rctx.os.name
#     host_cpu = rctx.os.arch
#     platform_info = get_platform_info(os = host_os, cpu = host_cpu)

#     rctx.download(
#         "https://releases.hashicorp.com/lima/{version}/lima_{version}_SHA256SUMS".format(version = version),
#         output = "checksums",
#     )

#     checksum_suffix = "lima_{version}_{os}_{cpu}.zip".format(version = version, os = platform_info.os, cpu = platform_info.cpu)
#     checksum_data = rctx.read("checksums")
#     checksum_lines = [line for line in checksum_data.splitlines() if line.endswith(checksum_suffix)]

#     if len(checksum_lines) != 1:
#         fail("Expected to find 1 checksum for {suffix}, found {count}".format(suffix = checksum_suffix, count = len(checksum_lines)))

#     checksum = checksum_lines[0].split(" ")[0]

#     rctx.report_progress("Downloading lima binary")

#     # results in lima/lima binary
#     rctx.download_and_extract(
#         "https://releases.hashicorp.com/lima/{version}/lima_{version}_{os}_{cpu}.zip".format(version = version, os = platform_info.os, cpu = platform_info.cpu),
#         output = "lima",
#         sha256 = checksum,
#     )

#     template_label = Label("//tools/lima:BUILD.repositories.bazel.tpl")

#     rctx.template(
#         "BUILD.bazel",
#         template_label,
#         executable = False,
#         substitutions = {
#             "{host_os}": host_os,
#             "{host_cpu}": host_cpu,
#             "{rules_lima_repo_name}": template_label.workspace_name,
#         },
#     )

# lima_download = repository_rule(
#     implementation = _lima_download_impl,
#     attrs = {
#         "version": attr.string(),
#     },
# )

def rules_lima_toolchains(version):
    # lima_download(name = "lima", version = version)
    # native.register_toolchains("@lima//:all")

    http_archive(
        name = "lima",
        build_file = "@//tools/lima:BUILD.repositories.bazel",
        # TODO: use select to download binary for different platform
        sha256 = "820f86d1486f70993cdcb535c93442a8d362f3992602c57a3cf0a8789090a802",
        urls = ["https://github.com/lima-vm/lima/releases/download/v0.9.2/lima-0.9.2-Darwin-x86_64.tar.gz"],
    )
