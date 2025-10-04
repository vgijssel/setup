# rules_task

`rules_task` is a Bazel ruleset for creating and running programs called tasks. It aims to be a simpler alternative than writing `sh_binary` targets and look similar to scripts you would write for CI/CD systems like GitHub and GitLab. It achieves this by using a basic rule definition and by exposing AST nodes for more complex tasks.

# Installation

Follow instructions from the release you wish to use: [rules_task releases](https://github.com/vgijssel/setup/releases?q=%22name+%3D+%5C%22rules_task%5C%22%22&expanded=true).

# Getting Started

1. Load the `task` rule in a `BUILD.bazel` file

```bazel
load("@rules_task//task:def.bzl", "task")
```

2. Create a task with the `task` rule

```bazel
task(
    name = "hello",
    cmds = [
        "echo Hello, world",
    ]
)
```

3. Run the task with `bazel run`

```bash
bazel run :hello
```

# Use cases

### Multiple commands in a single target

```bazel
task(
    name = "multiple_commands",
    cmds = [
        "echo hello",
        "echo world",
    ]
)
```

### Command with environment variables

```bazel
task(
    name = "env",
    cmds = [
        "echo $MY_ENV_VAR",
    ],
    env = {
        "MY_ENV_VAR": "Hello, world",
    }
)
```

Note that these environment variables are persisted inside the task binary, as opposed to the args / env arguments of `py_binary` and `sh_binary` rules. This means if this task target is called by another target, the environments will still be present.

### Runnning a command at exit

```bazel
task(
    name = "defer",
    cmds = [
        "echo 1",
        "echo 2",
        { "defer": "echo 3" },
        "echo 4",
        "exit 1",
        "echo 5",
    ],
)
```

This will print

```bash
1
2
4
3 # note this is executed after 4
```

### Passing cli arguments

A special environment variable `$CLI_ARGS` is available to all tasks, which contains the arguments passed to the task.

```bazel
task(
    name = "cli_args",
    cmds = [
        "echo $CLI_ARGS",
    ],
)
```

```bash
bazel run :cli_args -- "Hello, world"
```

### Setting a current working directory

This will set the current working directory to the root of the Bazel workspace.

```bazel
task(
    name = "cwd",
    cmds = [
        "pwd",
    ],
    cwd = "$BUILD_WORKSPACE_DIRECTORY",
)
```

### Using executable targets

You can use the `cmd.executable` AST node to reference other **executable** targets. This does some magic behind the scenes to make sure the target is tracked as a runfile dependency and the absolute path is resolved. This makes it easy to use in combination with a changed working directory. No need to add `$(location ...)` or `$(execpath ...)` statements or to explicitly add the target as a dependency in the `data` attribute.

```bazel
task(
    name = "executable",
    cmds = [
        "$tool",
    ],
    env = {
        "tool": cmd.executable("my_executable"),
    }
)
```

### Referencing outputs of other targets

You can use the `cmd.file` and `cmd.files` AST nodes to reference other targets. This does some magic behind the scenes to make sure the target is tracked as a runfile dependency and the absolute path is resolved.

```bazel
task(
    name = "file",
    cmds = [
        "echo $file",
        "cat $files",
    ],
    env = {
        "file": cmd.file("my_file"),
        "files": cmd.files(":my_file_group"),
    }
)
```

### Using variables from Bazel workspace_status_command / stamping

If you add the following variable to the `workspace_status_command`:

```bash
#!/bin/bash
echo "STABLE_SOME_VAR BAR"
```

Add add `stamp_stable` attribute to the `task` rule, you can use the variable in the task:

```bazel
task(
    name = "stamp_stable",
    cmds = [
        "echo $STABLE_SOME_VAR",
    ],
    stamp_stable = True,
)
```

This will print:

```bash
FOO
```

The same goes for volatile variables which has the benefit of not invalidating the Bazel cache if only the volatile variable changes ([docs](https://bazel.build/docs/user-manual#workspace-status)). With the following `workspace_status_command`:

```bash
#!/bin/bash
echo "SOME_OTHER_VAR BAR"
```

And the `stamp_volatile` attribute:

```bazel
task(
    name = "stamp_volatile",
    cmds = [
        "echo $SOME_OTHER_VAR",
    ],
    stamp_volatile = True,
)
```

This will print:

```bash
BAR
```

It's also possible to override stamped environment variables from a task caller:

```
task(
    name = "parent",
    cmds = [
        "export SOME_OTHER_VAR=parent_value",
        cmd.executable(":stamp_volatile"),
    ],
)
```

This will print

```bash
parent_value
```

### More examples

For more examples, see the [tests](tests/BUILD.bazel).

# AST nodes

Using the AST nodes directly allows for more advanced use cases. The current AST visitor implementation does not allow for nested nodes of the same type because Starlark does not support recursion. This means that you cannot use `cmd.defer` inside a `cmd.defer` or `cmd.file` inside a `cmd.file`. This is a limitation of the current implementation and may be resolved in the future.

Load the `cmd` rule in a `BUILD.bazel` file

```bazel
load("@rules_task//task:def.bzl", "cmd")
```

### `cmd.root`

Is used by the `task` rule to define the root of the AST. It is not meant to be used directly currently, due to the recursion limitation of the current visitor.

### `cmd.env`

This allows you to set environment variables using a dict in any place of the AST.

```bazel
task(
    name = "env_ast",
    cmds = [
        "echo $MY_ENV_VAR",
        cmd.env({
            "MY_ENV_VAR": "bar",
        }),
        "echo $MY_ENV_VAR",
    ],
    env = {
        "MY_ENV_VAR": "foo",
    }
)
```

This will print

```bash
foo
bar
```

### `cmd.defer`

Previously example `{ "defer": "echo 3" }` is syntactic sugar for `cmd.defer("echo 3")`.

### `cmd.shell`

The `cmd.shell` is the default node for each of the arguments of the `cmd.root` node. For example

```bazel
task(
    name = "hello",
    cmds = [
        "echo Hello, world",
    ]
)
```

Can also be written as

```bazel
task(
    name = "shell",
    cmds = [
        cmd.shell("echo Hello, world"),
    ]
)
```

or

```bazel
task(
    name = "shell_args",
    cmds = [
        cmd.shell("echo", "Hello", "world"),
    ]
)
```

which is useful for passing arguments to a command. This also allows passing a `cmd.executable` without relying on `cmd.env`

```bazel
task(
    name = "shell_and_executable",
    cmds = [
        cmd.shell(cmd.executable(":my_executable"), "some", "args"),
    ]
)
```

### `cmd.file`

See [Referencing outputs of other targets](#referencing-outputs-of-other-targets)

### `cmd.files`

See [Referencing outputs of other targets](#referencing-outputs-of-other-targets)

### `cmd.version_file`

Instead of using the `stamp_stable` and `stamp_volatile` flags, you can use the `cmd.version_file` node to reference the file containing the stable variables. Given a `workspace_status_command` like:

```bash
#!/bin/bash
echo "VOLATILE_SOME_VAR BAR"
```

And running `cat` on the the version file

```bazel
task(
    name = "version_file",
    cmds = [
        cmd.shell("cat", cmd.version_file()),
    ],
)
```

This will print

```bash
export VOLATILE_SOME_VAR='BAR'
```

### `cmd.info_file`

This is the same as `cmd.version_file` but for the info file, this gives you the volatile variables.

### `cmd.executable`

See [Using executable targets](#using-executable-targets)

### `cmd.string`

This is used for most of the leaf nodes, at the end of the AST. For example

```bazel
cmd.shell("echo", "hello", world)
```

can also be written as

```bazel
cmd.shell(cmd.string("echo"), cmd.string("hello"), cmd.string("world"))
```

but is arguably less readable.

# Inspiration/Alternatives

- [task](https://github.com/go-task/task) - rules_task is heavily inspired by the task tool, taking some of the best ideals like deferred execution.
- [multirun](https://github.com/atlassian/bazel-tools/blob/master/multirun/README.md) - Initial inspiration for rules_task, making it easy to run multiple commands directly from a Bazel file
- [rules_multirun](https://github.com/keith/rules_multirun) - Modern and maintained version of the Atlassian multirun tool.
