import { Command } from "commander";
const program = new Command();

import BazelDifferChangeAction from "./lib/actions/BazelDifferChangeAction.mjs";

program
  .name("bazel-diff-change-cli")
  .description("CLI to interact with bazel-diff for release-manager")
  .requiredOption("--bazel-differ-path <string>", "Path to bazel-differ")
  .option(
    "--generate-hashes-extra-args <string>",
    "Additional args to pass to bazel-differ generate-hashes command",
    ""
  )
  .option(
    "--diff-extra-args <string>",
    "Additional args to pass to bazel-differ diff command",
    ""
  )
  .requiredOption(
    "--previous-revision-cmd <string>",
    "Executable to get previous git revision"
  )
  .requiredOption(
    "--final-revision-cmd <string>",
    "Executable to get final git revision"
  )
  .argument("<label>", "Bazel Target Label to diff")
  .version("0.0.0")
  .action(async (label, options) => {
    const action = new BazelDifferChangeAction(label, options);
    await action.execute();
  });

program.parse();
