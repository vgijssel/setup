default: 
    just --list

# Build the hypervisor image
hypervisor-build:
    bazel build --show_progress --worker_verbose --verbose_failures --test_output=streamed -s //hypervisor:hypervisor_image

# Run the hypervisor image
hypervisor-dev-start:
    bazel run //hypervisor:kitchen -- create

# Stop the hypervisor image
hypervisor-dev-stop:
    bazel run //hypervisor:kitchen -- destroy

# Test the hypervisor image using kitchen
hypervisor-test:
    bazel run //hypervisor:kitchen -- verify

# Provision the hypervisor with Pyinfra
hypervisor-provision:
    bazel run --show_progress --worker_verbose --verbose_failures --test_output=streamed -s //hypervisor:provision

# Interact with the hypervisor kitchen binary
hypervisor-kitchen +args:
    bazel run //hypervisor:kitchen -- {{args}}

# Run the bazel remote cache server
bazel-remote-start:
    docker rm -f bazel-remote-cache || true
    docker run \
        --name bazel-remote-cache \
        --rm \
        -d \
        -u 1000:1000 \
        -v $(pwd)/tools/bazel/bazel-remote-config.yml:/bazel-remote-config.yml \
        -v $(pwd)/cache/bazel_cache:/data \
        -p 8080:8080 \
        -p 9092:9092 \
        quay.io/bazel-remote/bazel-remote \
        --config_file /bazel-remote-config.yml

# Stop the bazel remote cache server
bazel-remote-stop:
    docker rm -f bazel-remote-cache

# Invoke the packer binary directly
packer +args:
    bazel run @packer//:packer_binary -- {{args}}

# Invoke the pyinfra binary directly
pyinfra +args:
    bazel run @hypervisor_deps_pyinfra//:rules_python_wheel_entry_point_pyinfra -- {{args}}

# Invoke the inspec binary directly
inspec +args:
    bazel run @hypervisor_bundle//:bin/inspec -- {{args}}

# Invoke the kitchen binary directly
kitchen +args:
    cd {{invocation_directory()}}; bazel run @hypervisor_bundle//:bin/kitchen -- {{args}}
