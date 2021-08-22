ssh_config = text_file(
    name = "ssh_config.templ",
    content = f"""
Include ~/.ssh/config
Include /etc/ssh/ssh_config
Include $PLEASE_ROOT/{CONFIG.SSH_CONFIG_DIR}/*
    """,
)

sh_cmd(
    name = "ssh",
    out = "ssh",
    cmd = f"""
    set -Eeou pipefail

    # https://unix.stackexchange.com/questions/108873/removing-a-directory-from-path/291611#291611
    function path_remove {{
        # Delete path by parts so we can never accidentally remove sub paths
        PATH=${PATH//":$1:"/":"} # delete any instances in the middle
        PATH=${PATH/#"$1:"/} # delete any instance at the beginning
        PATH=${PATH/%":$1"/} # delete any instance in the at the end
    }}

    # TODO: this is not a great way to make sure we have the right root
    export PLEASE_ROOT="${{PLEASE_ROOT:-$PWD}}"

    SSH_CONFIG_TEMPL="$PLEASE_ROOT/$(out_location {ssh_config})"
    SSH_CONFIG_DIR="$PLEASE_ROOT/$(out_dir {ssh_config})"
    SSH_CONFIG="$SSH_CONFIG_DIR/ssh_config"
    ANCHOR="$(out_dir :ssh)"

    cat $SSH_CONFIG_TEMPL | envsubst '$PLEASE_ROOT' > $SSH_CONFIG

    # Remove the folder which contains this ssh binary from the path
    # to prevent endless recursion calling ssh on the next line
    path_remove "$ANCHOR"
    path_remove "$PLEASE_ROOT/$ANCHOR"

    echo $PATH > /tmp/kerk
    echo $PLEASE_ROOT > /tmp/kerk_root
    echo $ANCHOR > /tmp/kerk_achor

    ARGS="-F $SSH_CONFIG ${@:-}"

    ssh $ARGS
    """,
    expand_env_vars = False,
    shell = "/usr/bin/env bash",
    visibility = ["PUBLIC"],
    deps = [ssh_config],
)