default: 
    just --list

# TODO: install buildifier using asdf?
# Install bazel to the local system
install-bazel:
    asdf plugin-add bazel https://github.com/mrinalwadhwa/asdf-bazel.git || true
    asdf install
    asdf reshim bazel

# Build the hypervisor image
hypervisor-build:
    bazel build --show_progress --worker_verbose --verbose_failures --test_output=streamed -s //hypervisor:hypervisor

# Invoke the packer binary directly
packer +args:
    bazel run @packer//:packer_binary -- {{args}}
    