import BazelDiffRepository from "../repositories/BazelDiffRepository.mjs";
import { path } from "zx";

export default class BazelDiffChangeAction {
  constructor(
    label,
    {
      generateHashesExtraArgs,
      getImpactedTargetsExtraArgs,
      bazelDiffPath,
      previousRevisionCmd,
      finalRevisionCmd,
    }
  ) {
    this.label = label;
    this.generateHashesExtraArgs = generateHashesExtraArgs;
    this.getImpactedTargetsExtraArgs = getImpactedTargetsExtraArgs;
    this.bazelDiffPath = bazelDiffPath;
    this.previousRevisionCmd = previousRevisionCmd;
    this.finalRevisionCmd = finalRevisionCmd;
  }

  async execute() {
    const workspaceDir = process.env.BUILD_WORKSPACE_DIRECTORY || process.cwd();
    const hashesDir = path.join(workspaceDir, "tmp", "bazel-diff-hashes");

    const bazelDiffRepository = new BazelDiffRepository({
      bazelDiffPath: this.bazelDiffPath,
      generateHashesExtraArgs: this.generateHashesExtraArgs,
      getImpactedTargetsExtraArgs: this.getImpactedTargetsExtraArgs,
      workspaceDir: workspaceDir,
      hashesDir: hashesDir,
      previousRevisionCmd: this.previousRevisionCmd,
      finalRevisionCmd: this.finalRevisionCmd,
    });

    const hasLabelChanged = await bazelDiffRepository.hasLabelChanged(
      this.label
    );
    console.log(hasLabelChanged);
  }
}
