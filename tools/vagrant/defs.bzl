load("@bazel_skylib//rules:copy_file.bzl", "copy_file")
load("//tools/bazel:defs.bzl", "runner_binary")

def qcow_to_vagrant_box(name, src, src_sha):
    native.genrule(
        name = name,
        outs = [
            "{}.box".format(name),
        ],
        cmd = """
        $(execpath //tools/vagrant:qcow_to_vagrant_box) $(execpath //tools/vagrant:box.ovf) $(execpath {src}) $(OUTS) $$(cat $(execpath {src_sha}))
        """.format(src = src, src_sha = src_sha),
        srcs = [
            src,
            src_sha,
            "//tools/vagrant:box.ovf",
        ],
        tools = [
            "//tools/vagrant:qcow_to_vagrant_box",
        ],
    )

def vagrant_run(name, vagrantfile, env = {}, data = [], deps = []):
    env_string = ""
    for key, value in env.items():
        env_string += 'export {}="{}"\n'.format(key, value)

    vagrantfile_target = "{}.Vagrantfile".format(name)

    copy_file(
        name = vagrantfile_target,
        src = vagrantfile,
        out = "{}/Vagrantfile".format(name),
        allow_symlink = True,
    )

    runner_binary(
        name = name,
        cmd = """
        {env_string}

        export VAGRANT_ARGS="$$@"
        export VAGRANT_BINARY="$(VAGRANT_BINARY_PATH)"
        export VAGRANT_CWD="$$(dirname $$(rlocation $(WORKSPACE_NAME)/$(OUT)))"

        $$VAGRANT_BINARY $$VAGRANT_ARGS
        """.format(env_string = env_string),
        data = data + [vagrantfile_target],
        deps = deps,
        out = "{}/vagrant".format(name),
        toolchains = [
            "@vagrant//:toolchain",
        ],
    )
