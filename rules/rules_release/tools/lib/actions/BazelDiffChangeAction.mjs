import BazelDiffRepository from "../repositories/BazelDiffRepository.mjs";

export default class BazelDiffChangeAction {
  constructor(
    label,
    {
      generate_hashes_extra_args,
      get_impacted_targets_extra_args,
      bazel_diff_path,
      previous_revision,
      final_revision,
    }
  ) {
    this.label = label;
    this.generate_hashes_extra_args = generate_hashes_extra_args;
    this.get_impacted_targets_extra_args = get_impacted_targets_extra_args;
    this.bazel_diff_path = bazel_diff_path;
    this.previous_revision = previous_revision;
    this.final_revision = final_revision;
  }

  async execute() {
    const bazelDiffRepository = new BazelDiffRepository({
      bazelDiffPath: this.bazel_diff_path,
      generateHashesExtraArgs: this.generate_hashes_extra_args,
      getImpactedTargetsExtraArgs: this.get_impacted_targets_extra_args,
      workspaceDir: process.env.BUILD_WORKSPACE_DIRECTORY || process.cwd(),
      hashesDir: "bazel_diff_hashes",
      previousRevision: this.previous_revision,
      finalRevision: this.final_revision,
    });
    const impactedTargets = await bazelDiffRepository.getImpactedTargets();
    console.log(impactedTargets);
  }
}
