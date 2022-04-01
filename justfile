default: 
    just --list

# TODO: install buildifier using asdf?
# Install bazel to the local system
install-bazel:
    asdf plugin-add bazel https://github.com/mrinalwadhwa/asdf-bazel.git || true
    asdf install
    asdf reshim bazel
    