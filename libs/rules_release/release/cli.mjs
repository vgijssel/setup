import { Command } from "commander";
const program = new Command();

function collect(val, memo) {
  memo.push(val);
  return memo;
}

import GenerateAction from "./lib/actions/GenerateAction.mjs";
import VersionAction from "./lib/actions/VersionAction.mjs";
import PublishAction from "./lib/actions/PublishAction.mjs";

program
  .name("release-manager")
  .description("CLI to manage releases using changesets and Bazel")
  .option("-c, --config <items>", "Config items", collect, [])
  .version("0.0.0");

program
  .command("generate")
  .description("Generate changesets based on changed releases")
  .action(async (options) => {
    const action = new GenerateAction({
      configPaths: program.opts().config,
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

program
  .command("publish")
  .description(
    "Run the publish scripts for each release and for the release manager"
  )
  .option(
    "--publish-cmd <items>",
    "Publish commands of the release manager",
    collect,
    []
  )
  .action(async (options) => {
    const action = new PublishAction({
      configPaths: program.opts().config,
      publishCmds: options.publishCmd,
    });
    await action.execute();
  });

program.parse();
