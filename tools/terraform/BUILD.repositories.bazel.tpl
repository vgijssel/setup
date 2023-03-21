package(default_visibility = ["//visibility:public"])

sh_binary(
    name = "terraform_binary",
    srcs = ["terraform"],
)
