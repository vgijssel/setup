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
        "build.sh",
        "flake.lock",
        "flake.nix",
        "configuration.nix",
        "configuration-lima.nix",
        "goss.yaml",
    ],
)

shell_command(
    name = "image",
    timeout = 600,
    command = "./build.sh $(cat ./image-builder.docker-info.json | jq -r '.image_id')",
    execution_dependencies = [
        ":image-builder",
        ":bastion-files",
    ],
    output_files = [
        "bastion.qcow2",
    ],
    runnable_dependencies = [":jq"],
    tools = [
        "bash",
        "cat",
        "docker",
        "ls",
    ],
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

run_shell_command(
    name = "provision",
    command = "./provision.sh $(cat {chroot}/bastion/image-builder.docker-info.json | jq -r '.image_id')",
    execution_dependencies = [
        ":image-builder",
    ],
    runnable_dependencies = [
        ":jq",
        ":docker",
    ],
)

system_binary(
    name = "nixos-rebuild",
    binary_name = "nixos-rebuild",
    fingerprint = "bin/nixos-rebuild binstub",
    fingerprint_args = ["pants-fingerprint"],
    fingerprint_dependencies = [
        ":bash",
    ],
)

system_binary(
    name = "nix",
    binary_name = "nix",
    fingerprint = "bin/nix binstub",
    fingerprint_args = ["pants-fingerprint"],
    fingerprint_dependencies = [
        ":bash",
    ],
)

system_binary(
    name = "limactl",
    binary_name = "limactl",
    fingerprint = "limactl version 0.23.1",
    fingerprint_args = ["--version"],
)

system_binary(
    name = "jq",
    binary_name = "jq",
    fingerprint = "jq-1.7.1",
    fingerprint_args = ["--version"],
)

system_binary(
    name = "bash",
    binary_name = "bash",
)

system_binary(
    name = "docker",
    binary_name = "docker",
)

file(
    name = "bastion-vm-config",
    source = "bastion-vm.yaml",
)
