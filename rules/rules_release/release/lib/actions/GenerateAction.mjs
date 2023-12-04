import ReleaseRepository from "../repositories/ReleaseRepository.mjs";
import ConfigRepository from "../repositories/ConfigRepository.mjs";
import ChangesetRepository from "../repositories/ChangesetRepository.mjs";

export default class GenerateAction {
  constructor({ configPaths }) {
    this.configPaths = configPaths;
  }

  async execute() {
    const configRepository = new ConfigRepository();
    const releaseRepository = new ReleaseRepository(this.configPaths);
    const changesetRepository = new ChangesetRepository({
      workspaceDir: configRepository.workspaceDir(),
      changesetDir: configRepository.changesetDir(),
    });
    const changedReleases = await releaseRepository.getChangedReleases();

    console.log(changedReleases);

    const releaseLabels = await releaseRepository.getAllLabels();

    // const impactedTargets = await targetRepository.getImpactedTargets();
    // const changedReleaseLabels = impactedTargets.filter((target) => {
    //   return releaseLabels.includes(target);
    // });

    // for (const changedReleaseLabel of changedReleaseLabels) {
    //   const release = await releaseRepository.getByLabel(changedReleaseLabel);
    //   const changeset = await changesetRepository.writeChangeset({
    //     name: release.name,
    //   });
    //   console.log(changeset);
    // }
  }
}
