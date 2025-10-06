import { Command } from "commander";
const program = new Command();

import BazelDiffChangeAction from "./lib/actions/BazelDiffChangeAction.mjs";

program
  .name("bazel-diff-change-cli")
  .description("CLI to interact with bazel-diff for release-manager")
  .requiredOption("--bazel-diff-path <string>", "Path to bazel-diff")
  .option(
    "--generate-hashes-extra-args <string>",
    "Additional args to pass to bazel-diff generate-hashes command",
    ""
  )
  .option(
    "--get-impacted-targets-extra-args <string>",
    "Additional args to pass to bazel-diff get-impacted-targets command",
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
    const action = new BazelDiffChangeAction(label, options);
    await action.execute();
  });

program.parse();
