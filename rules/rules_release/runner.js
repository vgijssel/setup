console.log(process.env.PWD);
const { Command } = require("commander");
const program = new Command();
const getImpactedTargets = require("./lib/get-impacted-targets");
const getConfig = require("./lib/get-config.js");
const write = require("@changesets/write").default;

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
      workspaceDir: config.workspaceDir(),
    });

    const changedReleaseLabels = impactedTargets.filter((target) => {
      return releaseLabels.includes(target);
    });

    console.log(changedReleaseLabels);

    const changeset = {
      summary: "A description of a minor change",
      releases: [
        { name: "@changesets/something", type: "minor" },
        { name: "@changesets/something-else", type: "patch" },
      ],
    };

    const uniqueId = await write(changeset, config.workspaceDir());
    console.log(uniqueId); // orange-foxes-waggle
  });

program.parse();
