def _rules_vagrant_toolchains_impl(rctx):
    rctx.template(
        "BUILD.bazel",
        rctx.attr._build_tpl,
        substitutions = {
            "{binary_path}": rctx.attr.binary_path,
            "{rules_vagrant_repo_name}": rctx.attr._build_tpl.workspace_name,
        },
    )

_rules_vagrant_toolchains = repository_rule(
    implementation = _rules_vagrant_toolchains_impl,
    attrs = {
        "binary_path": attr.string(mandatory = True),
        "_build_tpl": attr.label(default = "//tools/vagrant:BUILD.repositories.bazel.tpl"),
    },
)

def rules_vagrant_toolchains(binary_path):
    _rules_vagrant_toolchains(
        name = "vagrant",
        binary_path = binary_path,
    )
    native.register_toolchains("@vagrant//:all")
