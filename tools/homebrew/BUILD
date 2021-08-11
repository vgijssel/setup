remote_file(
    name = "regctl",
    binary = True,
    extract = False,
    url = "https://github.com/regclient/regclient/releases/download/v0.3.5/regctl-darwin-amd64",
    visibility = ["PUBLIC"],
)

remote_file(
    name = "jq",
    binary = True,
    extract = False,
    url = "https://github.com/stedolan/jq/releases/download/jq-1.6/jq-osx-amd64",
    visibility = ["PUBLIC"],
)

filegroup(
    name = "homebrew",
    srcs = ["homebrew.build_defs"],
    visibility = ["PUBLIC"],
)
