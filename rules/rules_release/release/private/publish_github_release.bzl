load("@rules_task//:defs.bzl", "cmd", "task")

def publish_github_release(name, release, changelog_file = None, before_cmds = [], env = {}):
    version_file = "{}.version".format(release)
    changelog_file = changelog_file or "{}.version_changelog".format(release)

    task(
        name = name,
        cmds = [
            cmd.shell("$GH", "$CLI_ARGS"),
        ],
        # cmds = before_cmds + [
        #     "export VERSION=$(cat $VERSION_FILE)",
        #     "export RELEASE_TAG=bunq2ynab-v$VERSION",
        #     "export GH_TOKEN=$($OP read op://vgijssel-prod/github-release/credential)",
        #     "export RELEASE_EXISTS=$($GH release view $RELEASE_TAG > /dev/null 2>&1 && echo true || echo false)",
        #     "if [ $RELEASE_EXISTS = true ]; then echo 'Release already exists, exitting.'; exit 0; fi",
        #     "$GH release create $RELEASE_TAG --notes-file $CHANGELOG_FILE --title $RELEASE_TAG",
        # ],
        env = {
            # "VERSION_FILE": cmd.file(version_file),
            # "CHANGELOG_FILE": cmd.file(changelog_file),
            "GH": cmd.executable("@github_cli//tool"),
        },
    )

# ------------------------------------ GitHub CLI ------------------------------------ #

# # From https://github.com/cli/cli/releases/

# http_archive(
#     name = "github_cli_linux_arm64",
#     build_file = "//tools/github_cli:BUILD.repositories.bazel.tpl",
#     sha256 = "e29e51efae58693cab394b983771bc0c73b400e429dd1d7339fc62c8b257c74a",
#     url = "https://github.com/cli/cli/releases/download/v2.39.1/gh_2.39.1_linux_arm64.tar.gz",
# )

# http_archive(
#     name = "github_cli_linux_amd64",
#     build_file = "//tools/github_cli:BUILD.repositories.bazel.tpl",
#     sha256 = "18a1bc97eb72305ff20e965d3c67aee7e1ac607fabc6251c7374226d8c41422b",
#     url = "https://github.com/cli/cli/releases/download/v2.39.1/gh_2.39.1_linux_amd64.tar.gz",
# )

# http_archive(
#     name = "github_cli_darwin_arm64",
#     build_file = "//tools/github_cli:BUILD.repositories.bazel.tpl",
#     sha256 = "f854225778b7215480c442cd2e3eeec1a56d33876bbbad19daf557c1b00d6913",
#     url = "https://github.com/cli/cli/releases/download/v2.39.1/gh_2.39.1_macOS_arm64.zip",
# )
