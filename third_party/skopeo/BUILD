package(default_visibility = ["PUBLIC"])

subinclude("//tools/homebrew")

homebrew_bottle(
    name = "skopeo",
    version = "1.4.1",
)

sh_cmd(
    name = "bin",
    cmd = """
    ARGS="$@"
    $PLEASE_ROOT/$(out_location :skopeo)/skopeo $ARGS
    """,
    deps = [":skopeo"],
)