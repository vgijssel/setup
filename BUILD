docker_environment(
    name = "image-builder",
    image = "image-builder:dev",
    platform = "linux_arm64",
    shell_setup_executable_search_paths = [
        "/root/.nix-profile/bin",
        "/nix/var/nix/profiles/default/bin",
        "/nix/var/nix/profiles/default/sbin",
    ],
)
