subinclude("//tools/packer")

packer_build(
    name = "kernel",
    srcs = {
        "cloud_init_meta_data": "./cloud-init/meta-data",
        "cloud_init_user_data": "./cloud-init/user-data",
        "playbook": "./build.yml",
        "kernel_config": "./config-4.19.155-fc.x86_64",
        "ansible_config": "./ansible.cfg",
    },
    outs = [
        "vmlinux.bin",
    ],
    env = {
        "ANSIBLE_CONFIG": "echo $(location //build_helpers/defs:ansible.cfg)",
    },
    templates = [
        "./packer_qemu.pkr.hcl",
        "./provision.pkr.hcl",
    ],
    toolchain = "//third_party/packer",
    tools = {
        "ANSIBLE_PLAYBOOK": "//third_party/ansible|ansible-playbook",
    },
    variables = {
        "iso_file": "echo $(location //third_party/ubuntu:ubuntu_focal)",
        "iso_checksum": "echo $(location //third_party/ubuntu:ubuntu_focal_checksum)",
        "ssh_private_key_file": "echo $(location //secrets:id_rsa)",
        "vm_name": "echo kernel",
        "cloud_init_meta_data": "echo $SRCS_CLOUD_INIT_META_DATA",
        "cloud_init_user_data": "echo $SRCS_CLOUD_INIT_USER_DATA",
        "ansible_playbook_binary": "echo $TOOLS_ANSIBLE_PLAYBOOK",
        "ansible_playbook": "echo $SRCS_PLAYBOOK",
        "kernel_file": "echo vmlinux.bin",
    },
    deps = [
        "//secrets:id_rsa",
        "//third_party/ubuntu:ubuntu_focal",
        "//third_party/ubuntu:ubuntu_focal_checksum",
    ],
)