docker_image(
    name = "image-builder",
    dependencies = [
        ":bastion-files",
    ],
    extra_run_args = [
        "--volume=./bastion:/opt/bastion",
    ],
    image_tags = ["dev"],
)

files(
    name = "bastion-files",
    sources = [
        "flake.lock",
        "flake.nix",
    ],
)

shell_command(
    name = "image",
    timeout = 300,
    # command = "ls -la > world.txt",
    command = "nix build .#nixosConfigurations.bastion.config.formats.qcow && cp -v result/nixos.qcow2 bastion.qcow2",
    environment = "image-builder",
    execution_dependencies = [":bastion-files"],
    output_files = ["bastion.qcow2"],
    # output_files = ["world.txt"],
    tools = [
        "cp",
        "nix",
    ],
    # tools = ["ls"],
)
