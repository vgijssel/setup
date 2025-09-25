import os
import sys

import jinja2
import runfiles

r = runfiles.Create()
environment = jinja2.Environment(undefined=jinja2.StrictUndefined)


def _rlocation_to_path(rlocation):
    p = r.Rlocation(rlocation)

    if not p:
        raise Exception("Unable to find runfile: {}".format(rlocation))

    return os.path.abspath(p)


def jinja_render_string(string):
    template = environment.from_string(string)
    return template.render(os=os, rlocation_to_path=_rlocation_to_path)


def main(instructions) -> None:
    _, *cli_args = sys.argv
    cli_args = " ".join(cli_args)

    # Making sure the current Python executable is in front of the PATH
    # so python based cmds can use this Python as well.
    # TODO: is this still needed?
    os.environ["PATH"] = (
        os.path.dirname(sys.executable) + os.pathsep + os.environ["PATH"]
    )

    trap_add = """
# From https://stackoverflow.com/a/30650385
#===================================================================
# FUNCTION trap_add ()
#
# Purpose:  appends a command to a trap
#
# - 1st arg:  code to add
# - remaining args:  names of traps to modify
#
# Example:  trap_add 'echo "in trap DEBUG"' DEBUG
#
# See: http://stackoverflow.com/questions/3338030/multiple-bash-traps-for-the-same-signal
#===================================================================
trap_add() {
    trap_add_cmd=$1; shift || fatal "${FUNCNAME} usage error"
    new_cmd=
    for trap_add_name in "$@"; do
        # Grab the currently defined trap commands for this trap
        existing_cmd=`trap -p "${trap_add_name}" |  awk -F"'" '{echo $2}'`

        [ -z "${existing_cmd}" ] && existing_cmd="echo"

        # Generate the new command
        new_cmd="${existing_cmd};${trap_add_cmd}"

        # Assign the test
         trap   "${new_cmd}" "${trap_add_name}" || \
                fatal "unable to add to trap ${trap_add_name}"
    done
}
    """

    bash_cmd = f"""
    set -Eeou pipefail
    {trap_add}
    """

    for cmd in instructions["cmds"]:
        bash_cmd += cmd + "\n"

    bash_cmd = jinja_render_string(bash_cmd)

    cmd_env = os.environ.copy()
    cmd_env["CLI_ARGS"] = cli_args

    cmd = ["bash", "-c", bash_cmd]

    os.execlpe(cmd[0], *cmd, cmd_env)


if __name__ == "__main__":
    main()
