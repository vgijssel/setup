load("@rules_task//:defs.bzl", "cmd", "task")

def publish_github_release(name, release, changelog_file = None, assets = [], before_cmds = [], env = {}):
    version_file = "{}.version".format(release)
    changelog_file = changelog_file or "{}.version_changelog".format(release)
    release_name_file = "{}.release_name".format(release)

    assets_to_upload = [cmd.file(a) for a in assets]

    target_env = {
        "VERSION_FILE": cmd.file(version_file),
        "CHANGELOG_FILE": cmd.file(changelog_file),
        "RELEASE_NAME_FILE": cmd.file(release_name_file),
        "GH": cmd.executable(Label("//tools/github_cli")),
        "ASSETS": cmd.shell(*assets_to_upload),
    }

    for k, v in env.items():
        if k in target_env:
            fail("env key {} already exists".format(k))

        target_env[k] = v

    task(
        name = name,
        cmds = before_cmds + [
            "export VERSION=$(cat $VERSION_FILE)",
            "export RELEASE_NAME=$(cat $RELEASE_NAME_FILE)",
            "export RELEASE_TAG=$RELEASE_NAME-v$VERSION",
            "export RELEASE_EXISTS=$($GH release view $RELEASE_TAG > /dev/null 2>&1 && echo true || echo false)",
            "if [ $RELEASE_EXISTS = true ]; then echo 'Release already exists, exitting.'; exit 0; fi",
            "$GH release create $RELEASE_TAG --notes-file $CHANGELOG_FILE --title $RELEASE_TAG $ASSETS",
        ],
        env = target_env,
        cwd = "$BUILD_WORKSPACE_DIRECTORY",
    )
