import BazelDiffRepository from "../repositories/BazelDiffRepository.mjs";
import { path } from "zx";

export default class BazelDiffChangeAction {
  constructor(
    label,
    {
      generate_hashes_extra_args,
      get_impacted_targets_extra_args,
      bazel_diff_path,
      previous_revision_cmd,
      final_revision_cmd,
    }
  ) {
    this.label = label;
    this.generate_hashes_extra_args = generate_hashes_extra_args;
    this.get_impacted_targets_extra_args = get_impacted_targets_extra_args;
    this.bazel_diff_path = bazel_diff_path;
    this.previous_revision_cmd = previous_revision_cmd;
    this.final_revision_cmd = final_revision_cmd;
  }

  async execute() {
    const workspaceDir = process.env.BUILD_WORKSPACE_DIRECTORY || process.cwd();
    const hashesDir = path.join(workspaceDir, "tmp", "bazel-diff-hashes");

    const bazelDiffRepository = new BazelDiffRepository({
      bazelDiffPath: this.bazel_diff_path,
      generateHashesExtraArgs: this.generate_hashes_extra_args,
      getImpactedTargetsExtraArgs: this.get_impacted_targets_extra_args,
      workspaceDir: workspaceDir,
      hashesDir: hashesDir,
      previousRevisionCmd: this.previous_revision_cmd,
      finalRevisionCmd: this.final_revision_cmd,
    });

    const hasLabelChanged = await bazelDiffRepository.hasLabelChanged(
      this.label
    );
    console.log(hasLabelChanged);
  }
}
