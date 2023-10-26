load("@local_config_platform//:constraints.bzl", "HOST_CONSTRAINTS")

def host_container_platform(name):
    host_cpu, _host_os = HOST_CONSTRAINTS

    native.platform(
        name = name,
        constraint_values = [
            host_cpu,
            "@platforms//os:linux",
        ],
    )
