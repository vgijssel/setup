import ReleaseRepository from "../repositories/ReleaseRepository.mjs";
import ConfigRepository from "../repositories/ConfigRepository.mjs";
import PublishRepository from "../repositories/PublishRepository.mjs";

export default class PublishAction {
  constructor({ configPaths }) {
    this.configPaths = configPaths;
  }

  async execute() {
    const configRepository = new ConfigRepository();
    const releaseRepository = new ReleaseRepository(this.configPaths);
    const publishRepository = new PublishRepository();
    const releases = await releaseRepository.getAll();

    for (const release of releases) {
      for (const publishCmd of release.publish_cmds) {
        await publishRepository.executeCmd(publishCmd);
      }
    }

    //     const packageRepository = new PackageRepository({
    //       packagesDir: configRepository.packagesDir(),
    //     });
    //     const versionRepository = new VersionRepository();
    //     const changesetRepository = new ChangesetRepository({
    //       workspaceDir: configRepository.workspaceDir(),
    //       changesetDir: configRepository.changesetDir(),
    //       changesetBinaryPath: this.changesetsPath,
    //     });
    //     const changelogRepository = new ChangelogRepository();
    //     const releases = await releaseRepository.getAll();

    //     for (const release of releases) {
    //       const releaseVersion = await versionRepository.getByFile(
    //         release.version_file
    //       );

    //       const packageFile = await packageRepository.write({
    //         name: release.name,
    //         version: releaseVersion,
    //         deps: release.deps,
    //       });

    //       await changelogRepository.write(
    //         path.dirname(packageFile),
    //         release.changelog_file
    //       );
    //     }

    //     await changesetRepository.updateVersions();

    //     for (const release of releases) {
    //       const packageData = await packageRepository.getContentByName(
    //         release.name
    //       );
    //       const currentVersion = await versionRepository.getByFile(
    //         release.version_file
    //       );
    //       const newVersion = packageData.version;

    //       await versionRepository.updateByFile(release.version_file, newVersion);

    //       const packageFile = packageRepository.getPathByName(release.name);
    //       await changelogRepository.copyBackIntoFile(
    //         path.dirname(packageFile),
    //         release.changelog_file
    //       );

    //       console.log(
    //         `Updated version for release ${release.name} from ${currentVersion} to ${newVersion}`
    //       );
    //     }
    //   }
  }
}
