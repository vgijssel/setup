load("@python3//:defs.bzl", "interpreter")

def _symlink_python_interpreter_impl(repository_ctx):
    repository_ctx.file('BUILD.bazel', content='''
package(default_visibility = ["//visibility:public"])
exports_files(["python"])
''')
    python_path = repository_ctx.path(Label(interpreter))
    repository_ctx.symlink(python_path, 'python')

_symlink_python_interpreter = repository_rule(
    implementation=_symlink_python_interpreter_impl,
    local=True,
)

def _python_interpreter(module_ctx):
    _symlink_python_interpreter(
        name = "python_interpreter",
    )

python_interpreter = module_extension(
    implementation = _python_interpreter,
)