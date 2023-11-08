const { Command } = require("commander");
const program = new Command();

function collect(val, memo) {
  memo.push(val);
  return memo;
}

const GenerateAction = require("./lib/actions/GenerateAction");

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
  .action(async () => {
    // const {
    //   config: configPaths,
    //   bazelDiffPath,
    //   bazelDiffArgs,
    // } = program.opts();
    // const config = await getConfig(configPaths);
    // console.log(config._releaseData);
    console.log("version");
  });

program.parse();

// cli program
// generate action
// release repository: get releases / get changed releases
// target repository: get impacted targets
// changeset repository: write changesets
// version action
