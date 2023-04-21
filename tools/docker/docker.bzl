"""
For quickly loading and running docker images built by Bazel.
"""

load("@rules_task//:defs.bzl", "cmd", "task")

def docker_load_and_run(name, image, command, docker_args = []):
    """
    Loads a docker image and runs it.
    """
    image_label = image
    image_sha_label = "{}.json.sha256".format(image_label)

    task(
        name = name,
        cmds = [
            """
        DEFAULT_ARGS="$command"
        CLI_ARGS="$CLI_ARGS"
        ARGS=${CLI_ARGS:-$DEFAULT_ARGS}
        DOCKER_DIGEST_FILE=$image_sha_label
        DOCKER_DIGEST=$(cat $DOCKER_DIGEST_FILE)
        DOCKER_LOAD_FILE=$image_label

        # if CLI_ARGS is set, then add interactive flag
        if [[ ! -z "$CLI_ARGS" ]]; then
            DOCKER_INTERACTIVE_ARGS="-it"
        else
            DOCKER_INTERACTIVE_ARGS=""
        fi

        if ! docker image inspect $DOCKER_DIGEST > /dev/null 2>&1 ; then
            $DOCKER_LOAD_FILE
        else
            echo "Image already exists"
        fi

        docker run --rm $DOCKER_INTERACTIVE_ARGS $docker_args $DOCKER_DIGEST $ARGS
        """,
        ],
        env = {
            "command": command,
            "docker_args": "'" + " ".join(docker_args) + "'",
            "image_label": cmd.file(image_label),
            "image_sha_label": cmd.file(image_sha_label),
        },
    )
