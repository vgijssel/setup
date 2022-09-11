load("//tools/bazel:defs.bzl", "runner_binary")

def docker_load_and_run(name, image, command, docker_args = []):
    """
    Loads a docker image and runs it.
    """
    image_label = image
    image_sha_label = "{}.json.sha256".format(image_label)

    runner_binary(
        name = name,
        cmd = """
        DEFAULT_ARGS="{command}"
        CLI_ARGS="$$@"
        ARGS=$${{CLI_ARGS:-$$DEFAULT_ARGS}}
        DOCKER_DIGEST_FILE=$$(rlocation $(WORKSPACE_NAME)/$(rootpath {image_sha_label}))
        DOCKER_DIGEST=$$(cat $$DOCKER_DIGEST_FILE)
        DOCKER_LOAD_FILE=$$(rlocation $(WORKSPACE_NAME)/$(rootpath {image_label}))

        # if CLI_ARGS is set, then add interactive flag
        if [[ ! -z "$$CLI_ARGS" ]]; then
            DOCKER_INTERACTIVE_ARGS="-it"
        else
            DOCKER_INTERACTIVE_ARGS=""
        fi

        if ! docker image inspect $$DOCKER_DIGEST > /dev/null 2>&1 ; then
            $$DOCKER_LOAD_FILE
        else
            echo "Image already exists"
        fi

        docker run --rm $$DOCKER_INTERACTIVE_ARGS {docker_args} $$DOCKER_DIGEST $$ARGS
        """.format(
            command = command,
            docker_args = " ".join(docker_args),
            image_label = image_label,
            image_sha_label = image_sha_label,
        ),
        out = "{}_runner.sh".format(name),
        deps = [
            image_label,
            image_sha_label,
        ],
    )
