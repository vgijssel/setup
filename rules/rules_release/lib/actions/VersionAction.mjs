import ReleaseRepository from "../repositories/ReleaseRepository.mjs";
import ConfigRepository from "../repositories/ConfigRepository.mjs";
import TargetRepository from "../repositories/TargetRepository.mjs";
import ChangesetRepository from "../repositories/ChangesetRepository.mjs";

export default class VersionAction {
  constructor({ configPaths }) {
    this.configPaths = configPaths;
  }

  async execute() {
    console.log("version");

    const configRepository = new ConfigRepository();
    const releaseRepository = new ReleaseRepository(this.configPaths);
    const targetRepository = new TargetRepository({
      workspaceDir: configRepository.workspaceDir(),
    });

    const releases = await releaseRepository.getAll();

    console.log(releases);

    //   const releaseDependencies = await targetRepository.getDependencies(
    //     release
    //   );

    // //:foo has a dependency on @rules_task//:all_files
    // //tools/bunq2ynab:release has a dependency on @rules_task//:all_files

    // release called //:foo_release with a target of //:foo
    // release called @rules_task//:rules_task_release with a target of @rules_task//:all

    // - collect all releases
    // - create package.json for each release file
    // - for each release determine (transitive) dependencies and append to package.json
    // - run changeset version command
    // - extract updated version information and write to version file
    // - extract updated changelog information and write to changelog file

    // const targetRepository = new TargetRepository({
    //   bazelDiffPath: this.bazelDiffPath,
    //   bazelDiffArgs: this.bazelDiffArgs,
    //   workspaceDir: configRepository.workspaceDir(),
    // });
    // const changesetRepository = new ChangesetRepository({
    //   workspaceDir: configRepository.workspaceDir(),
    // });
    // const releaseLabels = await releaseRepository.getAllLabels();
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
