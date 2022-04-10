default: 
    just --list

# Build the hypervisor image
hypervisor-build:
    bazel build --show_progress --worker_verbose --verbose_failures --test_output=streamed -s //hypervisor:hypervisor_image

# Run the hypervisor image
hypervisor-run +args:
    VAGRANT_EXPERIMENTAL="cloud_init,disks" HYPERVISOR_BOX_PATH=bazel-bin/hypervisor/hypervisor_image_box.box VAGRANT_CWD=hypervisor bazel run @vagrant_bundle//:bin/bundle -- exec vagrant {{args}}

# Provision the hypervisor with Pyinfra
hypervisor-provision:
    bazel run --show_progress --worker_verbose --verbose_failures --test_output=streamed -s //hypervisor:provision

# Invoke the packer binary directly
packer +args:
    bazel run @packer//:packer_binary -- {{args}}

# Invoke the limactl binary directly
limactl +args:
    bazel run @lima//:limactl -- {{args}}

# Invoke the pyinfra binary directly
pyinfra +args:
    bazel run @hypervisor_deps_pyinfra//:rules_python_wheel_entry_point_pyinfra -- {{args}}

# Invoke the vagrant binary directly
vagrant +args:
    VAGRANT_CWD={{invocation_directory()}} bazel run @vagrant_bundle//:bin/bundle -- exec vagrant {{args}}
