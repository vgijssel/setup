import BazelDiffRepository from "../repositories/BazelDiffRepository.mjs";

export default class BazelDiffChangeAction {
  constructor({
    generate_hashes_extra_args,
    get_impacted_targets_extra_args,
    bazel_diff_path,
  }) {
    this.generate_hashes_extra_args = generate_hashes_extra_args;
    this.get_impacted_targets_extra_args = get_impacted_targets_extra_args;
    this.bazel_diff_path = bazel_diff_path;
  }

  async execute() {
    const bazelDiffRepository = new BazelDiffRepository();
    console.log("action");
  }
}
