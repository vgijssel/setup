load("@bazel_skylib//rules:copy_file.bzl", "copy_file")
load("//tools/bazel:defs.bzl", "runner_binary")

def qcow_to_vagrant_box(name, src):
    native.genrule(
        name = name,
        outs = [
            "{}.box".format(name),
        ],
        cmd = """
        $(execpath //tools/vagrant:qcow_to_vagrant_box) $(execpath //tools/vagrant:box.ovf) $(execpath {src}) $(OUTS)
        """.format(src = src),
        srcs = [
            src,
            "//tools/vagrant:box.ovf",
        ],
        tools = [
            "//tools/vagrant:qcow_to_vagrant_box",
        ],
    )

def vagrant_run(name, vagrantfile, env = {}, data = []):
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

    # TODO: vagrant cannot import the box because the file name is too long
    # this is because the box is deep inside the bazel directory structure
    # can we symlink the box in the /tmp directory and import from there?
    # though that kinda defeats the purpose of having the configure env variables :/
    runner_binary(
        name = name,
        cmd = """
        set -Eeou pipefail

        {env_string}

        export VAGRANT_ARGS="$$@"
        export VAGRANT_BINARY="$(VAGRANT_BINARY_PATH)"
        export VAGRANT_CWD="$$(dirname $$(rlocation $(WORKSPACE_NAME)/$(OUT)))"

        $$VAGRANT_BINARY $$VAGRANT_ARGS
        """.format(env_string = env_string),
        data = data + [vagrantfile_target],
        out = "{}/vagrant".format(name),
        toolchains = [
            "@vagrant//:toolchain",
        ],
    )
