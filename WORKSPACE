load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive", "http_file")
load("//tools/packer:repositories.bzl", "rules_packer_toolchains")
load("//tools/lima:repositories.bzl", "rules_lima_toolchains")

rules_packer_toolchains(
    version = "1.8.0",
)

rules_lima_toolchains()

# https://cloud-images.ubuntu.com/focal/20220404/
http_file(
    name = "ubuntu_focal",
    sha256 = "8c8b5acb521f53a32e6ee53505e85d43958e42794c77dbb54dbe797097a63c5d",
    urls = [
        "https://cloud-images.ubuntu.com/focal/20220404/focal-server-cloudimg-amd64.img",
    ],
)

http_archive(
    name = "rules_python",
    sha256 = "9fcf91dbcc31fde6d1edb15f117246d912c33c36f44cf681976bd886538deba6",
    strip_prefix = "rules_python-0.8.0",
    url = "https://github.com/bazelbuild/rules_python/archive/refs/tags/0.8.0.tar.gz",
)

load("@rules_python//python:repositories.bzl", "python_register_toolchains")

python_register_toolchains(
    name = "python3_9",
    python_version = "3.9",
)

load("@python3_9//:defs.bzl", "interpreter")
load("@rules_python//python:pip.bzl", "pip_parse")

pip_parse(
    name = "hypervisor_deps",
    python_interpreter_target = interpreter,
    requirements_lock = "//hypervisor:requirements_lock.txt",
)

load("@hypervisor_deps//:requirements.bzl", "install_deps")

install_deps()
