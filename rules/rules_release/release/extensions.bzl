load(":repositories.bzl", "dependencies")

def _non_module_dependencies_impl(_ctx):
    dependencies()

non_module_dependencies = module_extension(
    implementation = _non_module_dependencies_impl,
)
