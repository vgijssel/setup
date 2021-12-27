sh_cmd(
    name = "provision",
    cmd = """
    export PLEASE_ROOT=$(plz query reporoot)
    export PLAYBOOK="$PLEASE_ROOT/$(out_location provision.yml)"
    export VARS="$PLEASE_ROOT/$(out_location credentials.yml)"
    export EXTRA_ARGS="$@"

    $PLEASE_ROOT/$(out_location //third_party/ansible|ansible-playbook) -i hypervisor, $PLAYBOOK $EXTRA_ARGS --extra-vars "@$VARS"
    """,
    paths = [
        "//tools/ssh",
    ],
    deps = [
        "//third_party/ansible",
    ],
)