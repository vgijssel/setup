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

    for (const changedRelease of changedReleases) {
      const changeset = await changesetRepository.writeChangeset({
        name: changedRelease.name,
      });
      console.log(changeset);
    }
  }
}
