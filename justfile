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
