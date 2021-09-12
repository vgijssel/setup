subinclude("//build_helpers/defs:docker")

subinclude("//tools/template")

template(
    name = "dockerfile",
    srcs = ["./Dockerfile"],
    subs = [
        "./base",
        "./scripts",
        "//third_party/digitalrebar:archive",
        "//third_party/digitalrebar:sledgehammer",
        "//third_party/digitalrebar:version",
    ],
)

docker_build(
    name = "digitalrebar",
    srcs = [
        "./base",
        "./scripts",
        "//third_party/digitalrebar:archive",
        "//third_party/digitalrebar:sledgehammer",
    ],
    dockerfile = ":dockerfile",
    visibility = ["PUBLIC"],
)

export_file(
    name = "provision.yml",
    src = "./provision.yml",
)

# TODO: can we convert this into a ansible_playbook rule?
sh_cmd(
    name = "provision",
    cmd = """
    # This forces the output of this rule to change when the playbook changes
    PLAYBOOK_HASH="$(hash :provision.yml)"
    PLAYBOOK="$PLEASE_ROOT/$(out_location :provision.yml)"

    EXTRA_VARS="--extra-vars drpcli='$PLEASE_ROOT/$(out_location //third_party/digitalrebar:drpcli)'"
    EXTRA_VARS="$EXTRA_VARS --extra-vars license='$PLEASE_ROOT/$(out_location //secrets:rackn-license)'"

    $PLEASE_ROOT/$(out_location //third_party/ansible|ansible-playbook) $EXTRA_VARS -i provisioner, $PLAYBOOK
    """,
    paths = [
        "//tools/ssh",
    ],
    visibility = ["PUBLIC"],
    deps = [
        ":provision.yml",
        "//secrets:rackn-license",
        "//third_party/ansible",
        "//third_party/digitalrebar:drpcli",
    ],
)