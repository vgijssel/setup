const getImpactedTargets = require("../get-impacted-targets");
const getConfig = require("../get-config.js");
const fileExists = async (path) => !!(await stat(path).catch((e) => false));
const { rename, stat } = require("fs").promises;
const write = require("@changesets/write").default;

class GenerateAction {
  constructor({ configPaths, bazelDiffPath, bazelDiffArgs }) {
    this.configPaths = configPaths;
    this.bazelDiffPath = bazelDiffPath;
    this.bazelDiffArgs = bazelDiffArgs;
  }

  async execute() {
    const config = await getConfig(this.configPaths);

    console.log(config._releaseData);

    const releaseLabels = config.releaseLabels();

    const impactedTargets = getImpactedTargets({
      bazelDiffPath: this.bazelDiffPath,
      bazelDiffArgs: this.bazelDiffArgs,
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
  }
}

module.exports = GenerateAction;
