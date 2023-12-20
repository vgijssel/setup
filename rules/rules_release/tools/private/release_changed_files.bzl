load("//release:defs.bzl", "release")
load("@rules_task//task:defs.bzl", "cmd", "task")

def release_changed_files(changed_file_paths, previous_revision_cmd = None, final_revision_cmd = None, **kwargs):
    name = kwargs.get("name")
    change_cmd_name = "{}.change_cmd".format(name)
    previous_revision_cmd_name = previous_revision_cmd
    final_revision_cmd_name = final_revision_cmd

    if not previous_revision_cmd_name:
        previous_revision_cmd_name = "{}.previous_revision_cmd".format(name)

        task(
            name = previous_revision_cmd_name,
            cmds = [
                "git rev-parse master",
            ],
            cwd = "$BUILD_WORKSPACE_DIRECTORY",
        )

    if not final_revision_cmd_name:
        final_revision_cmd_name = "{}.final_revision_cmd".format(name)

        task(
            name = final_revision_cmd_name,
            cmds = [
                "git rev-parse HEAD",
            ],
            cwd = "$BUILD_WORKSPACE_DIRECTORY",
        )

    task(
        name = change_cmd_name,
        cmds = [
            "PREVIOUS_REVISION=$($PREVIOUS_REVISION_CMD)",
            "FINAL_REVISION=$($FINAL_REVISION_CMD)",
            "HAS_CHANGED=$(git diff --name-only $PREVIOUS_REVISION $FINAL_REVISION -- $CHANGED_FILES)",
            'if [ -z "$HAS_CHANGED" ]; then echo "false"; else echo "true"; fi',
        ],
        cwd = "$BUILD_WORKSPACE_DIRECTORY",
        env = {
            "PREVIOUS_REVISION_CMD": cmd.executable(previous_revision_cmd_name),
            "FINAL_REVISION_CMD": cmd.executable(final_revision_cmd_name),
            "CHANGED_FILES": cmd.shell(*changed_file_paths),
        },
    )

    release(change_cmd = change_cmd_name, **kwargs)
