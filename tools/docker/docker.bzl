"""
For quickly loading and running docker images built by Bazel.
"""

load("@rules_task//task:defs.bzl", "cmd", "task")

def docker_load(name, image, **kwargs):
    """
    Loads a docker image and return the image name.
    """
    image_label = "{}.tar".format(image)
    image_sha_label = "{}.json.sha256".format(image)

    task(
        name = name,
        cmds = [
            """
        DOCKER_DIGEST_FILE=$image_sha_label
        DOCKER_DIGEST=$(cat $DOCKER_DIGEST_FILE)
        DOCKER_LOAD_FILE=$image_label

        if ! docker image inspect $DOCKER_DIGEST > /dev/null 2>&1 ; then
            docker load --input $DOCKER_LOAD_FILE >&2
        else
            echo Image already exists >&2
        fi

        echo $DOCKER_DIGEST
        """,
        ],
        env = {
            "image_label": cmd.file(image_label),
            "image_sha_label": cmd.file(image_sha_label),
        },
        **kwargs
    )
