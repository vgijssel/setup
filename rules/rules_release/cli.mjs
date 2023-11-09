import { Command } from "commander";
const program = new Command();

function collect(val, memo) {
  memo.push(val);
  return memo;
}

import GenerateAction from "./lib/actions/GenerateAction.mjs";
import VersionAction from "./lib/actions/VersionAction.mjs";

program
  .name("release-manager")
  .description("CLI to manage releases using changesets and Bazel")
  .option("-c, --config <items>", "Config items", collect, [])
  .version("0.0.0");

program
  .command("generate")
  .description(
    "Generate changesets based on changed targets with latest master"
  )
  .requiredOption("--bazel-diff-path <string>")
  .option(
    "--bazel-diff-args <string>",
    "Additional args generate hashes command for bazel-diff"
  )
  .action(async (options) => {
    const action = new GenerateAction({
      configPaths: program.opts().config,
      bazelDiffPath: options.bazelDiffPath,
      bazelDiffArgs: options.bazelDiffArgs,
    });
    await action.execute();
  });

program
  .command("version")
  .description("Update version files based on changesets")
  .requiredOption("--changesets-path <string>")
  .action(async (options) => {
    const action = new VersionAction({
      configPaths: program.opts().config,
      changesetsPath: options.changesetsPath,
    });
    await action.execute();
  });

program.parse();
