const { Command } = require("commander");
const program = new Command();
const getImpactedTargets = require("./lib/get-impacted-targets");

function collect(val, memo) {
  memo.push(val);
  return memo;
}

program
  .name("release-manager")
  .description("CLI to manage releases using changesets and Bazel")
  .option("-c, --config <items>", "Config items", collect, [])
  .requiredOption("--bazel-diff-path <string>")
  .version("0.0.0");

program
  .command("generate")
  .description(
    "Generate changesets based on changed targets with latest master"
  )
  .action(() => {
    const { config, bazelDiffPath } = program.opts();

    const releases = [];

    const impactedTargets = getImpactedTargets({
      bazelDiffPath,
    });

    const changedReleases = impactedTargets.filter((target) => {
      return releases.includes(target);
    });

    console.log(changedReleases);

    // write out changesets
  });

program.parse();
