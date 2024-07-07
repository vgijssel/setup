"""A generated module for Setup functions

This module has been generated via dagger init and serves as a reference to
basic module structure as you get started with Dagger.

Two functions have been pre-created. You can modify, delete, or add to them,
as needed. They demonstrate usage of arguments and return types using simple
echo and grep commands. The functions can be called from the dagger CLI or
from one of the SDKs.

The first line in this comment block is a short description line and the
rest is a long description with more detail on the module's purpose or usage,
if appropriate. All modules should have a short description.
"""

import dagger
from dagger import dag, function, object_type


@object_type
class Setup:
    @function
    def container_echo(self, string_arg: str) -> dagger.Container:
        """Returns a container that echoes whatever string argument is provided"""
        return dag.container().from_("alpine:latest").with_exec(["echo", string_arg])

    @function
    async def grep_dir(self, directory_arg: dagger.Directory, pattern: str) -> str:
        """Returns lines that match a pattern in the files of the provided Directory"""
        return await (
            dag.container()
            .from_("alpine:latest")
            .with_mounted_directory("/mnt", directory_arg)
            .with_workdir("/mnt")
            .with_exec(["grep", "-R", pattern, "."])
            .stdout()
        )

    # TODO: add caching volume. This can only be done BEFORE nix is installed, otherwise
    # you remove all the files in the nix store by mounting the cache.
    # nixos-generate -f docker -c /src/configuration.nix
    # Able to export the archive using:  dagger call example --source example export --path ./archive
    # Able to import the archive using:  docker load -i ./archive nixos:dev
    # Able to run the container using:  docker run -it --rm --privileged nixos:dev /init
    @function
    def example(self, source: dagger.Directory) -> dagger.Container:
        return (
            dag.nix()
            .setup_nix()
            .with_exec(
                ["nix", "profile", "install", "github:nix-community/nixos-generators"]
            )
            # .with_mounted_cache("/nix", dag.cache_volume("nix"))
            .with_directory("/src", source)
            .with_exec(
                [
                    "nixos-generate",
                    "-f",
                    "docker",
                    "-c",
                    "/src/configuration.nix",
                    "-o",
                    "/tmp/kerk",
                ]
            )
            .file("/tmp/kerk/tarball/nixos-system-aarch64-linux.tar.xz")
        )
