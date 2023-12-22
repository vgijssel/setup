package(default_visibility = ["//visibility:public"])

filegroup(
    name = "binary",
    srcs = ["mutagen"],
)

filegroup(
    name = "agent_files",
    srcs = ["mutagen-agents.tar.gz"],
)