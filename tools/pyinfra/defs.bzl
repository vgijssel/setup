def _pyinfra_run_impl(ctx):
    env_string = ""

    for key, value in ctx.attr.env.items():
        env_string = "export {key}={value};\n".format(key = key, value = ctx.expand_location(value))

    # # Create the pyinfra runner script which can be executed by Bazel.
    # pyinfra_runner = ctx.actions.declare_file("{}.runner".format(ctx.label.name))
    # ctx.actions.expand_template(
    #     template = ctx.file._runner_tpl,
    #     substitutions = {
    #         "{pyinfra_binary}": ctx.executable.pyinfra_runtime.short_path,
    #         "{inventory_file}": ctx.file.inventory.short_path,
    #         "{deploy_file}": ctx.file.deploy.short_path,
    #         "{env_string}": env_string,
    #     },
    #     output = pyinfra_runner,
    #     is_executable = True,
    # )

    # # print(pyinfra_runner.path)
    # # print(ctx.attr.pyinfra_runtime)
    # # print(ctx.attr.pyinfra_runtime.files_to_run)
    # # print(ctx.files.pyinfra_runtime)
    # # print(ctx.attr.pyinfra_runtime[DefaultInfo].default_runfiles.files)
    # # files = [ctx.file.deploy] + [ctx.file.inventory] + [ctx.executable.pyinfra_runtime]

    # # Copied from https://docs.bazel.build/versions/main/skylark/rules.html#runfiles
    # runfiles = ctx.runfiles(files = [ctx.file.deploy] + [ctx.file.inventory] + ctx.files.pyinfra_runtime + [pyinfra_runner] + [ctx.executable.pyinfra_runtime])
    # all_targets = [ctx.attr.deploy] + [ctx.attr.inventory] + ctx.attr.deps + [ctx.attr.pyinfra_runtime]
    # runfiles = runfiles.merge_all([
    #     target[DefaultInfo].default_runfiles
    #     for target in all_targets
    # ])

    # # Store the runfiles as files as well, so this rule can be used during building for example with Packer.
    # return [DefaultInfo(
    #     runfiles = runfiles,
    #     executable = pyinfra_runner,
    #     files = runfiles.files,
    # )]

    # TODO: Looks like the problem is build vs run
    # needs a different path for the pyinfra binary
    # build: path
    # run: short_path

    ### bazel build //hypervisor:shine
    # pyinfra_runner = ctx.actions.declare_file("{}.runner".format(ctx.label.name))
    # ctx.actions.expand_template(
    #     template = ctx.file._runner_tpl,
    #     substitutions = {
    #         "{pyinfra_binary}": ctx.executable.pyinfra_runtime.path,
    #     },
    #     output = pyinfra_runner,
    #     is_executable = True,
    # )

    # return [DefaultInfo(
    #     executable = pyinfra_runner,
    #     files = depset([ctx.executable.pyinfra_runtime]),
    # )]

    ### bazel run //hypervisor:provisioner
    # pyinfra_runner = ctx.actions.declare_file("{}.runner".format(ctx.label.name))
    # ctx.actions.expand_template(
    #     template = ctx.file._runner_tpl,
    #     substitutions = {
    #         "{pyinfra_binary}": ctx.executable.pyinfra_runtime.short_path,
    #     },
    #     output = pyinfra_runner,
    #     is_executable = True,
    # )

    # runfiles = ctx.attr.pyinfra_runtime[DefaultInfo].default_runfiles

    # return [DefaultInfo(
    #     executable = pyinfra_runner,
    #     runfiles = runfiles,
    # )]

    ### Final version
    # We need to differentiate between build and run for all of the binaries used within the runner.
    # can we use $(rlocation? )
    pyinfra_runner = ctx.actions.declare_file("{}.runner".format(ctx.label.name))
    ctx.actions.expand_template(
        template = ctx.file._runner_tpl,
        substitutions = {
            "{pyinfra_binary}": ctx.executable.pyinfra_runtime.short_path,
            "{env_string}": env_string,
        },
        output = pyinfra_runner,
        is_executable = True,
    )

    runfiles = ctx.runfiles()
    runfiles = runfiles.merge_all([
        ctx.attr.pyinfra_runtime[DefaultInfo].default_runfiles,
        ctx.attr._runfiles[DefaultInfo].default_runfiles,
    ])

    return [DefaultInfo(
        executable = pyinfra_runner,
        runfiles = runfiles,
        files = depset([ctx.executable.pyinfra_runtime] + ctx.files.deps + [ctx.file._runfiles]),
    )]

pyinfra_run = rule(
    implementation = _pyinfra_run_impl,
    executable = True,
    attrs = {
        # "deploy": attr.label(mandatory = True, allow_single_file = True),
        # "inventory": attr.label(mandatory = True, allow_single_file = True),
        "deps": attr.label_list(allow_files = True),
        "env": attr.string_dict(),
        "_runner_tpl": attr.label(
            default = Label("//tools/pyinfra:runner.sh.tpl"),
            allow_single_file = True,
        ),
        "pyinfra_runtime": attr.label(executable = True, cfg = "exec"),
        "_runfiles": attr.label(
            default = Label("@bazel_tools//tools/bash/runfiles"),
            allow_single_file = True,
        ),
    },
)

# def _pyinfra_runtime_impl(ctx):
#     output_files = []
#     pyinfractl_output_file = None

#     # We are copying all the files from pyinfra to the output directory
#     # and we keep the same structure as downloaded from the remote.
#     # this to make sure the "share" directory is in the right place
#     # relative to the pyinfractl binary.
#     for file in ctx.files.files:
#         # file.owner.name is the original file name
#         output_file_name = "{label}/{file_name}".format(label = ctx.label.name, file_name = file.owner.name)
#         output_file = ctx.actions.declare_file(output_file_name)
#         ctx.actions.run(
#             outputs = [output_file],
#             inputs = [file],
#             arguments = [file.path, output_file.path],
#             executable = "cp",
#             mnemonic = "CopyFile",
#         )
#         output_files.append(output_file)

#         if file.basename == "pyinfractl":
#             pyinfractl_output_file = output_file

#     if pyinfractl_output_file == None:
#         fail("pyinfractl not found in the runtime")

#     return [DefaultInfo(
#         executable = pyinfractl_output_file,
#         files = depset(output_files),
#     )]

# pyinfra_runtime = rule(
#     implementation = _pyinfra_runtime_impl,
#     executable = True,
#     attrs = {
#         "files": attr.label(mandatory = True),
#     },
# )
