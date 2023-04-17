load("@bazel_skylib//lib:shell.bzl", "shell")

def _update_labels(ctx, cmds):
    for cmd in cmds:
        if type(cmd) == "string":
            continue

        if cmd["type"] == "location":
            cmd["label"] = ctx.expand_location(cmd["label"], ctx.attr.data)

        elif cmd["type"] == "shell":
            for arg in cmd["args"]:
                if type(arg) == "string":
                    continue

                if arg["type"] == "location":
                    arg["label"] = ctx.expand_location("$(rlocationpath {})".format(arg["label"]), ctx.attr.data)

def _task_impl(ctx):
    instructions_file = ctx.actions.declare_file(ctx.label.name + ".json")
    out_file = ctx.actions.declare_file(ctx.label.name)

    runfiles = ctx.runfiles(files = [instructions_file] + ctx.files.data)
    runfiles = runfiles.merge_all([
        d[DefaultInfo].default_runfiles
        for d in ([ctx.attr._runner] + ctx.attr.data)
    ])

    cmds = json.decode(ctx.attr.cmd_json)

    _update_labels(ctx, cmds)

    runner_exe = ctx.executable._runner
    instructions = {
        "cmds": cmds,
        "workspace": ctx.workspace_name,
        "cwd": ctx.attr.cwd,
    }

    ctx.actions.write(
        output = instructions_file,
        content = json.encode(instructions),
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
            files = depset([out_file, instructions_file]),
            runfiles = runfiles,
        ),
    ]

_task = rule(
    implementation = _task_impl,
    executable = True,
    attrs = {
        "cmd_json": attr.string(mandatory = True),
        "cwd": attr.string(),
        "data": attr.label_list(allow_files = True),
        "_runner": attr.label(
            default = Label("//:runner"),
            cfg = "exec",
            executable = True,
        ),
    },
)

def _collect_data(cmds):
    data = []

    for cmd in cmds:
        if type(cmd) == "string":
            continue

        if cmd.type == "location":
            data.append(cmd.label)

        elif cmd.type == "shell":
            for arg in cmd.args:
                if type(arg) == "string":
                    continue

                if arg.type == "location":
                    data.append(arg.label)

    return data

def task(**kwargs):
    data = kwargs.pop("data", [])
    cmds = kwargs.pop("cmds")

    if "cmd_json" in kwargs:
        fail('The "cmd_json" attribute is reserved for internal use.')

    cmd_data = _collect_data(cmds)
    cmd_json = json.encode(cmds)

    _task(
        data = data + cmd_data,
        cmd_json = cmd_json,
        **kwargs
    )

cmd = struct(
    shell = lambda *args: struct(
        type = "shell",
        args = args,
    ),
    l = lambda label: struct(
        type = "location",
        label = str(native.package_relative_label(label)),
    ),
)
