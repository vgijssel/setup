import ReleaseRepository from "../repositories/ReleaseRepository.mjs";
import ConfigRepository from "../repositories/ConfigRepository.mjs";
import TargetRepository from "../repositories/TargetRepository.mjs";
import PackageRepository from "../repositories/PackageRepository.mjs";
import ChangesetRepository from "../repositories/ChangesetRepository.mjs";
import VersionRepository from "../repositories/VersionRepository.mjs";

import { getPackages } from "@manypkg/get-packages";
import { path } from "zx";

export default class VersionAction {
  constructor({ configPaths }) {
    this.configPaths = configPaths;
  }

  async execute() {
    const configRepository = new ConfigRepository();
    const releaseRepository = new ReleaseRepository(this.configPaths);
    const packageRepository = new PackageRepository({
      packagesDir: configRepository.packagesDir(),
    });
    const versionRepository = new VersionRepository();
    const releases = await releaseRepository.getAll();

    console.log(releases);

    await packageRepository.writeRoot();

    // write all the release files into package.json files
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

    // run the version command
    // extract the updated versions and write into the version files
    // const { packages, tool } = await getPackages(
    //   path.join(configRepository.workspaceDir(), "tmp", "rules_release")
    // );

    // console.log(packages);
    // console.log(tool);
  }
}
