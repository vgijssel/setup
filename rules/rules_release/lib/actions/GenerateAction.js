const getImpactedTargets = require("../get-impacted-targets");
const fileExists = async (path) => !!(await stat(path).catch((e) => false));
const { rename, stat } = require("fs").promises;
const write = require("@changesets/write").default;
const ReleaseRepository = require("../repositories/ReleaseRepository");
const ConfigRepository = require("../repositories/ConfigRepository");

class GenerateAction {
  constructor({ configPaths, bazelDiffPath, bazelDiffArgs }) {
    this.configPaths = configPaths;
    this.bazelDiffPath = bazelDiffPath;
    this.bazelDiffArgs = bazelDiffArgs;
  }

  async execute() {
    const configRepository = new ConfigRepository();
    const releaseRepository = new ReleaseRepository(this.configPaths);
    const releaseLabels = await releaseRepository.getAllLabels();

    const impactedTargets = getImpactedTargets({
      bazelDiffPath: this.bazelDiffPath,
      bazelDiffArgs: this.bazelDiffArgs,
      workspaceDir: configRepository.workspaceDir(),
    });

    const changedReleaseLabels = impactedTargets.filter((target) => {
      return releaseLabels.includes(target);
    });

    for (const changedReleaseLabel of changedReleaseLabels) {
      const release = await releaseRepository.getByLabel(changedReleaseLabel);
      const newFilePath = `${configRepository.workspaceDir()}/.changeset/${
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
      const uniqueId = await write(changeset, configRepository.workspaceDir());
      const oldFilePath = `${configRepository.workspaceDir()}/.changeset/${uniqueId}.md`;

      await rename(oldFilePath, newFilePath);
      console.log(`Created changeset ${newFilePath}`);
    }
  }
}

module.exports = GenerateAction;
