load("@rules_task//task:defs.bzl", "cmd", "task")
load("@rules_oci//oci:defs.bzl", "oci_push")
load("@aspect_bazel_lib//lib:copy_file.bzl", "copy_file")

def publish_oci_image(name, image, repository, remote_tags, before_cmds = [], env = {}):
    oci_push_name = "{}.push_oci".format(name)
    remote_tags_name = "{}.remote_tags".format(name)

    oci_push(
        name = oci_push_name,
        image = image,
        remote_tags = remote_tags,
        repository = repository,
    )

    target_env = {
        "REGCTL": cmd.executable(Label("//tools/regctl")),
        "REMOTE_TAGS_FILE": cmd.file(remote_tags),
        "PUSH_IMAGE": cmd.executable(oci_push_name),
    }

    for k, v in env.items():
        if k in target_env:
            fail("env key {} already exists".format(k))

        target_env[k] = v

    task(
        name = name,
        cmds = before_cmds + [
            "IMAGE_TAG=$(cat $REMOTE_TAGS_FILE)",
            "IMAGE={}:$IMAGE_TAG".format(repository),
            "CONTAINER_EXISTS=$($REGCTL image inspect $IMAGE > /dev/null 2>&1 && echo true || echo false)",
            "if [ $CONTAINER_EXISTS = true ]; then echo 'Image already exists, exitting.'; exit 0; fi",
            "$PUSH_IMAGE",
        ],
        env = target_env,
    )

    copy_file(
        name = remote_tags_name,
        src = remote_tags,
        out = "{}.txt".format(remote_tags_name),
    )
