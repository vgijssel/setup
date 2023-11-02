const { runfiles } = require("@bazel/runfiles");
const removePrefix = (value, prefix) =>
  value.startsWith(prefix) ? value.slice(prefix.length) : value;
const workspace = removePrefix(process.env.WORKSPACE, "@");
const bazel_diff = runfiles.resolve(`${workspace}/bazel-diff`);
