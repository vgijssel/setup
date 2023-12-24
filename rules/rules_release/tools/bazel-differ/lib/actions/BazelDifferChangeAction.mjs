import BazelDifferRepository from "../repositories/BazelDifferRepository.mjs";
import { path } from "zx";

export default class BazelDifferChangeAction {
  constructor(
    label,
    {
      bazelDifferPath,
      previousRevisionCmd,
      finalRevisionCmd,
      generateHashesExtraArgs,
      getImpactedTargetsExtraArgs,
    }
  ) {
    this.label = label;
    this.generatehashesextraargs = generatehashesextraargs;
    this.getimpactedtargetsextraargs = getimpactedtargetsextraargs;
    this.bazelDifferPath = bazelDifferPath;
    this.previousRevisionCmd = previousRevisionCmd;
    this.finalRevisionCmd = finalRevisionCmd;
  }

  async execute() {
    const workspaceDir = process.env.BUILD_WORKSPACE_DIRECTORY || process.cwd();
    const hashesDir = path.join(workspaceDir, "tmp", "bazel-differ-hashes");

    const bazelDifferRepository = new BazelDifferRepository({
      bazelDifferPath: this.bazelDifferPath,
      generateHashesExtraArgs: this.generateHashesExtraArgs,
      getImpactedTargetsExtraArgs: this.getImpactedTargetsExtraArgs,
      workspaceDir: workspaceDir,
      hashesDir: hashesDir,
      previousRevisionCmd: this.previousRevisionCmd,
      finalRevisionCmd: this.finalRevisionCmd,
    });

    const hasLabelChanged = await bazelDifferRepository.hasLabelChanged(
      this.label
    );
    console.log(hasLabelChanged);
  }
}
