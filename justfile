bazel_debug_config := if env_var_or_default("SETUP_DEBUG", "false") == "true" { "--config=debug" } else { "" }

default: 
    just --list

# Build the hypervisor image
hypervisor-build:
    bazel build {{ bazel_debug_config }} //hypervisor:hypervisor_image

# Run the hypervisor image
hypervisor-dev-start:
    bazel run {{ bazel_debug_config }} //hypervisor:kitchen -- create

# Stop the hypervisor image
hypervisor-dev-stop:
    bazel run {{ bazel_debug_config }} //hypervisor:kitchen -- destroy

# Login to the hypervisor machine
hypervisor-login:
    VAGRANT_CWD=hypervisor/.kitchen/kitchen-vagrant/default-ubuntu-focal vagrant ssh

# Test the hypervisor image using kitchen
hypervisor-test:
    bazel run {{ bazel_debug_config }} //hypervisor:kitchen -- verify

# Provision the hypervisor with Pyinfra
hypervisor-provision:
    bazel run {{ bazel_debug_config }} //hypervisor:provision

# Interact with the hypervisor kitchen binary
hypervisor-kitchen +args:
    bazel run {{ bazel_debug_config }} //hypervisor:kitchen -- {{ args }}

# Invoke the packer binary directly
packer +args:
    bazel run {{ bazel_debug_config }} @packer//:packer_binary -- {{ args }}

# Invoke the pyinfra binary directly
pyinfra +args:
    bazel run {{ bazel_debug_config }} @hypervisor_deps_pyinfra//:rules_python_wheel_entry_point_pyinfra -- {{ args }}

# Invoke the inspec binary directly
inspec +args:
    bazel run {{ bazel_debug_config }} @hypervisor_bundle//:bin/inspec -- {{ args }}

# Invoke the kitchen binary directly
kitchen +args:
    cd {{ invocation_directory() }}; bazel run @hypervisor_bundle//:bin/kitchen -- {{ args }}

changed-test-targets-current-branch:
    #!/usr/bin/env bash
    set -Eeou pipefail

    current_branch=$(git rev-parse --abbrev-ref HEAD)
    current_commit=$(git rev-parse HEAD)

    if [[ "$current_branch" == "master" ]]; then
        previous_commit=$(git rev-parse $current_commit^)  
    else
        # from https://stackoverflow.com/questions/1527234/finding-a-branch-point-with-git/71193866#71193866 
        current_branch_first_commit=$(git rev-list --exclude-first-parent-only ^origin/master $current_branch | tail -1)
        previous_commit=$(git rev-parse $current_branch_first_commit^)
    fi

    bazel run {{ bazel_debug_config }} //tools/bazel:changed-test-targets -- $previous_commit $current_commit

