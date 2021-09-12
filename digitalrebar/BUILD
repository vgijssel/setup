subinclude("//build_helpers/defs:docker")

subinclude("//tools/template")

template(
    name = "dockerfile",
    srcs = ["./Dockerfile"],
    subs = [
        "./scripts",
        "//third_party/digitalrebar:archive",
        "//third_party/digitalrebar:sledgehammer",
        "//third_party/digitalrebar:version",
    ],
)

docker_build(
    name = "digitalrebar",
    srcs = [
        "./scripts",
        "//third_party/digitalrebar:archive",
        "//third_party/digitalrebar:sledgehammer",
    ],
    dockerfile = ":dockerfile",
    visibility = ["PUBLIC"],
)

genrule(
    name = "discover_new",
    srcs = glob(["./discover_new/**/*.yml"]),
    outs = ["discover_new_bundle.yml"],
    cmd = f"""
    OUTS=$PWD/$OUTS
    cd $PKG_DIR/discover_new
    $TOOLS_DRPCLI contents bundle $OUTS
    """,
    tools = {
        "drpcli": "//third_party/digitalrebar:drpcli",
    },
)

filegroup(
    name = "playbook",
    srcs = [
        "./access_keys.json.j2",
        "./provision.yml",
        "./subnet.json.j2",
    ],
)

# TODO: can we convert this into a ansible_playbook rule?
sh_cmd(
    name = "provision",
    cmd = """
    # This forces the output of this rule to change when the playbook changes
    PLAYBOOK_HASH="$(hash :playbook)"
    PLAYBOOK="$PLEASE_ROOT/$(out_dir :playbook)/provision.yml"

    EXTRA_VARS="--extra-vars drpcli='$PLEASE_ROOT/$(out_location //third_party/digitalrebar:drpcli)'"
    EXTRA_VARS="$EXTRA_VARS --extra-vars license='$PLEASE_ROOT/$(out_location //secrets:rackn-license)'"
    EXTRA_VARS="$EXTRA_VARS --extra-vars public_key_path='$PLEASE_ROOT/$(out_location //secrets:id_rsa_pub)'"
    EXTRA_VARS="$EXTRA_VARS --extra-vars discover_new='$PLEASE_ROOT/$(out_location :discover_new)'"

    $PLEASE_ROOT/$(out_location //third_party/ansible|ansible-playbook) $EXTRA_VARS -i provisioner, $PLAYBOOK $@
    """,
    paths = [
        "//tools/ssh",
    ],
    visibility = ["PUBLIC"],
    deps = [
        ":discover_new",
        ":playbook",
        "//secrets:id_rsa_pub",
        "//secrets:rackn-license",
        "//third_party/ansible",
        "//third_party/digitalrebar:drpcli",
    ],
)
