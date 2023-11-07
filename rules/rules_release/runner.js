console.log(process.env.PWD);
const { Command } = require("commander");
const program = new Command();
const getImpactedTargets = require("./lib/get-impacted-targets");
const getConfig = require("./lib/get-config.js");

function collect(val, memo) {
  memo.push(val);
  return memo;
}

program
  .name("release-manager")
  .description("CLI to manage releases using changesets and Bazel")
  .option("-c, --config <items>", "Config items", collect, [])
  .requiredOption("--bazel-diff-path <string>")
  .option(
    "--bazel-diff-args <string>",
    "Additional args generate hashes command for bazel-diff"
  )
  .version("0.0.0");

program
  .command("generate")
  .description(
    "Generate changesets based on changed targets with latest master"
  )
  .action(async () => {
    const {
      config: configPaths,
      bazelDiffPath,
      bazelDiffArgs,
    } = program.opts();
    const config = await getConfig(configPaths);

    console.log(config._releaseData);

    const releaseLabels = config.releaseLabels();

    const impactedTargets = getImpactedTargets({
      bazelDiffPath,
      bazelDiffArgs,
    });

    const changedReleaseLabels = impactedTargets.filter((target) => {
      return releaseLabels.includes(target);
    });

    console.log(changedReleaseLabels);
  });

program.parse();
