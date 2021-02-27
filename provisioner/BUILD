# TODO: gzip the output as well?

load("@io_bazel_rules_docker//container:container.bzl", "container_image")

container_image(
    name = "provisioner-builder",
    base = "@packer-builder-arm//image:dockerfile_image.tar",
    # cmd = "ls -la /",
    # entrypoint = ["/entry.sh"],
    # env = {
    #     "PKR_VAR_setup_image_dir": "image",
    # },
    files = [
        # ":entry.sh",
        # ":packer_arm.pkr.hcl",
    ],
    legacy_run_behavior = False,
)

genrule(
    name = "provisioner-build",
    srcs = [
        "@ubuntu_arm//file",
        ":packer_arm.pkr.hcl",
    ],
    outs = ["provisioner.img"],
    cmd = """
    export DOCKER_BUILDKIT=0

    # TODO: how are we getting the name dynamically?
    export DOCKER_IMAGE_NAME=bazel/provisioner:provisioner-builder

    IMAGE_FILE="non_symlink_$$(basename $(location @ubuntu_arm//file))"
    export PKR_VAR_base_image_absolute_path="$$PWD/$$IMAGE_FILE"
    export PKR_VAR_output_image="$@"

    # Convert symlink to actual file because packer does not understand symlinks
    cat $(location @ubuntu_arm//file) > $$PKR_VAR_base_image_absolute_path

    # The docker container volume needs to be at the workspace root
    # This is because symlinks in the sandbox are poiting to files within the workspace
    # The SETUP_DIR comes from the host env passed in using --action_env in .bazelrc
    docker load -i $(location :provisioner-builder.tar)
    docker run \
       -w "$$PWD" \
       --rm \
       --privileged \
       --env "PKR_VAR_base_image_absolute_path" \
       --env "PKR_VAR_output_image" \
       -v /dev:/dev \
       -v "$$SETUP_DIR:$$SETUP_DIR" \
       -v "$$BAZEL_OUTPUT_USER_ROOT:$$BAZEL_OUTPUT_USER_ROOT" \
       $$DOCKER_IMAGE_NAME \
       build $(location :packer_arm.pkr.hcl)
    """,
    tools = [
        ":provisioner-builder.tar",
    ],
)
