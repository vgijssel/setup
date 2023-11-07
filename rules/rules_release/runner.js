console.log(process.env.PWD);
const { Command } = require("commander");
const program = new Command();
const getImpactedTargets = require("./lib/get-impacted-targets");
const getConfig = require("./lib/get-config.js");
const write = require("@changesets/write").default;
const { rename, stat } = require("fs").promises;
const fileExists = async (path) => !!(await stat(path).catch((e) => false));

function collect(val, memo) {
  memo.push(val);
  return memo;
}

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
    const { config: configPaths } = program.opts();
    const { bazelDiffPath, bazelDiffArgs } = options;
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

    for (const changedReleaseLabel of changedReleaseLabels) {
      const release = config.getReleaseByLabel(changedReleaseLabel);
      const newFilePath = `${config.workspaceDir()}/.changeset/${
        release.name
      }.md`;

      if (await fileExists(newFilePath)) {
        console.log(`Skipping ${newFilePath} as it already exists`);
        continue;
      }

      const changeset = {
        summary: "A change",
        releases: [{ name: release.name, type: "minor" }],
      };
      const uniqueId = await write(changeset, config.workspaceDir());
      const oldFilePath = `${config.workspaceDir()}/.changeset/${uniqueId}.md`;

      await rename(oldFilePath, newFilePath);
      console.log(`Created changeset ${newFilePath}`);
    }
  });

program
  .command("version")
  .description("Update version files based on changesets")
  .action(async () => {
    const {
      config: configPaths,
      bazelDiffPath,
      bazelDiffArgs,
    } = program.opts();
    const config = await getConfig(configPaths);

    console.log(config._releaseData);
  });

program.parse();
