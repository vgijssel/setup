docker_image(
    name = "image-builder",
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
        "configuration.nix",
    ],
)

shell_command(
    name = "image",
    timeout = 600,
    command = "nix build .#nixosConfigurations.bastion.config.formats.qcow && cp -v result/nixos.qcow2 bastion.qcow2",
    environment = "image-builder",
    execution_dependencies = [":bastion-files"],
    output_files = ["bastion.qcow2"],
    tools = [
        "cp",
        "nix",
    ],
)

system_binary(
    name = "limactl",
    binary_name = "limactl",
    fingerprint = "limactl version 0.23.1",
    fingerprint_args = ["--version"],
)

file(
    name = "bastion-vm-config",
    source = "bastion-vm.yaml",
)

run_shell_command(
    name = "start",
    command = """
    cd {chroot}/bastion && limactl delete -f bastion-vm && limactl start --plain --tty=false ./bastion-vm.yaml
    """,
    execution_dependencies = [
        ":image",
        ":bastion-vm-config",
    ],
    runnable_dependencies = [
        ":limactl",
    ],
)

# Run deploy-rs on the development machine
run_shell_command(
    name = "provision",
    command = "ls -la",
    execution_dependencies = [
        ":image-builder",
    ],
)
