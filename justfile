default: 
    just --list

# Build the hypervisor image
hypervisor-build:
    bazel build --show_progress --worker_verbose --verbose_failures --test_output=streamed -s //hypervisor:hypervisor_image

# Interact with the hypervisor vagrant 
hypervisor-vagrant +args:
    bazel run //hypervisor:dev -- {{args}}

# Run the hypervisor image
hypervisor-dev-start:
    bazel run //hypervisor:dev -- up

# Stop the hypervisor image
hypervisor-dev-stop:
    bazel run //hypervisor:dev -- destroy -f

# Provision the hypervisor with Pyinfra
hypervisor-provision:
    bazel run --show_progress --worker_verbose --verbose_failures --test_output=streamed -s //hypervisor:provision

# Invoke the packer binary directly
packer +args:
    bazel run @packer//:packer_binary -- {{args}}

# Invoke the pyinfra binary directly
pyinfra +args:
    bazel run @hypervisor_deps_pyinfra//:rules_python_wheel_entry_point_pyinfra -- {{args}}

# Invoke the inspec binary directly
inspec +args:
    bazel run @hypervisor_bundle//:bin/inspec -- {{args}}
