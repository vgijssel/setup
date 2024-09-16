local_environment(
    name = "local_linux_python",
    compatible_platforms = [
        "linux_x86_64",
        "linux_arm64",
    ],
    fallback_environment = "docker_linux_python",
)

docker_environment(
    name = "docker_linux_python",
    image = "python:3.10.14",
)
