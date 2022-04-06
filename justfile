default: 
    just --list

# Build the hypervisor image
hypervisor-build:
    bazel build --show_progress --worker_verbose --verbose_failures --test_output=streamed -s //hypervisor:hypervisor

# Invoke the packer binary directly
packer +args:
    bazel run @packer//:packer_binary -- {{args}}

# Invoke the limactl binary directly
limactl +args:
    bazel run @lima//:limactl -- {{args}}