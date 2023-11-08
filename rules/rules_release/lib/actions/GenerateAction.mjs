import ReleaseRepository from "../repositories/ReleaseRepository.mjs";
import ConfigRepository from "../repositories/ConfigRepository.mjs";
import TargetRepository from "../repositories/TargetRepository.mjs";
import ChangesetRepository from "../repositories/ChangesetRepository.mjs";

export default class GenerateAction {
  constructor({ configPaths, bazelDiffPath, bazelDiffArgs }) {
    this.configPaths = configPaths;
    this.bazelDiffPath = bazelDiffPath;
    this.bazelDiffArgs = bazelDiffArgs;
  }

  async execute() {
    const configRepository = new ConfigRepository();
    const releaseRepository = new ReleaseRepository(this.configPaths);
    const targetRepository = new TargetRepository({
      bazelDiffPath: this.bazelDiffPath,
      bazelDiffArgs: this.bazelDiffArgs,
      workspaceDir: configRepository.workspaceDir(),
    });
    const changesetRepository = new ChangesetRepository({
      workspaceDir: configRepository.workspaceDir(),
    });
    const releaseLabels = await releaseRepository.getAllLabels();
    const impactedTargets = await targetRepository.getImpactedTargets();
    const changedReleaseLabels = impactedTargets.filter((target) => {
      return releaseLabels.includes(target);
    });

    for (const changedReleaseLabel of changedReleaseLabels) {
      const release = await releaseRepository.getByLabel(changedReleaseLabel);
      const changeset = await changesetRepository.writeChangeset({
        name: release.name,
      });
      console.log(changeset);
    }
  }
}
