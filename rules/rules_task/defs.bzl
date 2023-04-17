load("@bazel_skylib//lib:shell.bzl", "shell")

def _task_impl(ctx):
    instructions_file = ctx.actions.declare_file(ctx.label.name + ".json")
    out_file = ctx.actions.declare_file(ctx.label.name)

    runfiles = ctx.runfiles(files = [instructions_file])

    runfiles = runfiles.merge_all([
        d[DefaultInfo].default_runfiles
        for d in [ctx.attr._runner]
    ])

    runner_exe = ctx.executable._runner

    ctx.actions.write(
        output = instructions_file,
        content = "{}",
    )

    script = "#!/usr/bin/env bash\n"
    script += 'exec ./%s %s "$@"\n' % (shell.quote(runner_exe.short_path), shell.quote(instructions_file.short_path))

    ctx.actions.write(
        output = out_file,
        content = script,
        is_executable = True,
    )

    return [
        DefaultInfo(
            executable = out_file,
            files = depset([out_file]),
            runfiles = runfiles,
        ),
    ]

_task = rule(
    implementation = _task_impl,
    executable = True,
    attrs = {
        "cmds": attr.string_list(mandatory = True),
        "_runner": attr.label(
            default = Label("//:runner"),
            cfg = "exec",
            executable = True,
        ),
    },
)

def task(**kwargs):
    _task(
        **kwargs
    )
