package(default_visibility = ["//visibility:public"])

sh_binary(
    name = "terramate_binary",
    srcs = ["terramate"],
)