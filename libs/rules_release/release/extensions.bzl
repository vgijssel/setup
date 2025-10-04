load(":repositories.bzl", "rules_release_dependencies")

def _non_module_dependencies_impl(_ctx):
    rules_release_dependencies()

non_module_dependencies = module_extension(
    implementation = _non_module_dependencies_impl,
)
