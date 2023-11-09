import ReleaseRepository from "../repositories/ReleaseRepository.mjs";
import ConfigRepository from "../repositories/ConfigRepository.mjs";
import PackageRepository from "../repositories/PackageRepository.mjs";
import VersionRepository from "../repositories/VersionRepository.mjs";
import ChangesetRepository from "../repositories/ChangesetRepository.mjs";

export default class VersionAction {
  constructor({ configPaths, changesetsPath }) {
    this.configPaths = configPaths;
    this.changesetsPath = changesetsPath;
  }

  async execute() {
    const configRepository = new ConfigRepository();
    const releaseRepository = new ReleaseRepository(this.configPaths);
    const packageRepository = new PackageRepository({
      packagesDir: configRepository.packagesDir(),
    });
    const versionRepository = new VersionRepository();
    const changesetRepository = new ChangesetRepository({
      workspaceDir: configRepository.workspaceDir(),
      changesetDir: configRepository.changesetDir(),
      changesetBinaryPath: this.changesetsPath,
    });
    const releases = await releaseRepository.getAll();

    console.log(releases);

    await packageRepository.writeRoot();

    for (const release of releases) {
      const releaseVersion = await versionRepository.getByFile(
        release.version_file
      );

      await packageRepository.write({
        name: release.name,
        version: releaseVersion,
        deps: release.deps,
      });
    }

    await changesetRepository.updateVersions();
  }
}
