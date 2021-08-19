ssh_config = text_file(
    name = "ssh_config.templ",
    content = f"""
Include ~/.ssh/config
Include /etc/ssh/ssh_config
Include $PLEASE_ROOT/tmp/vagrant/ssh_configs/*
    """,
)

sh_cmd(
    name = "ssh",
    visibility = ["PUBLIC"],
    deps = [ssh_config],
    shell = "/usr/bin/env bash",
    expand_env_vars = False,
    cmd = f"""
    set -Eeou pipefail

    # https://unix.stackexchange.com/questions/108873/removing-a-directory-from-path/291611#291611
    function path_remove {{
        # Delete path by parts so we can never accidentally remove sub paths
        PATH=${PATH//":$1:"/":"} # delete any instances in the middle
        PATH=${PATH/#"$1:"/} # delete any instance at the beginning
        PATH=${PATH/%":$1"/} # delete any instance in the at the end
    }}

    export PLEASE_ROOT="$PWD"
    SSH_CONFIG_TEMPL="$(out_location {ssh_config})"
    SSH_CONFIG_DIR="$(out_dir {ssh_config})"
    SSH_CONFIG="$SSH_CONFIG_DIR/ssh_config"
    ANCHOR="$(out_dir {ssh_config})"

    cat $SSH_CONFIG_TEMPL | envsubst '$PLEASE_ROOT' > $SSH_CONFIG

    # Remove the folder which contains this ssh binary from the path
    # to prevent endless recursion calling ssh on the next line
    path_remove "$ANCHOR"

    ARGS="-F $SSH_CONFIG ${@:-}"

    ssh $ARGS
    """
)