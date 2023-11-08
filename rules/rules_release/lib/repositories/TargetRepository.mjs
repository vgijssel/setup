import { mkdir, readFile } from "fs/promises";
import { $ } from "zx";
import { fileExists } from "../utils.mjs";

export default class TargetRepository {
  constructor({ bazelDiffPath, bazelDiffArgs, workspaceDir }) {
    this.bazelDiffPath = bazelDiffPath;
    this.bazelDiffArgs = bazelDiffArgs;
    this.workspaceDir = workspaceDir;
    this.hashesDir = `${this.workspaceDir}/tmp/bazel_diff_hashes`;
  }

  async getImpactedTargets() {
    if (!(await fileExists(this.hashesDir))) {
      mkdir(this.hashesDir, { recursive: true });
    }

    const bazelPath = await $`which bazel`;
    const previousCommit = (
      await $`git --work-tree=${this.workspaceDir} rev-parse master`
    ).stdout.trim();
    console.log(`previousCommit is ${previousCommit}`);

    const currentCommit = (
      await $`git --work-tree=${this.workspaceDir} rev-parse HEAD`
    ).stdout.trim();
    console.log(`currentCommit is ${currentCommit}`);

    const previousHashes = await this._generateHashesForSha(
      previousCommit,
      true
    );
    console.log(`previousHashes is ${previousHashes}`);

    const currentHashes = await this._generateHashesForSha(
      currentCommit,
      false
    );
    console.log(`currentHashes is ${currentHashes}`);

    const impactedTargets = await this._generateImpactedTargets(
      currentCommit,
      previousHashes,
      currentHashes,
      false
    );
    console.log(`impactedTargets is ${impactedTargets}`);

    const data = await readFile(impactedTargets, "utf8");
    const result = data.split("\n");
    return result;
  }

  async _generateHashesForSha(sha, cache) {
    const hashesFile = `${this.hashesDir}/${sha}.json`;

    console.log(hashesFile);

    if (cache && (await fileExists(hashesFile))) {
      return hashesFile;
    }

    const currentBranch =
      await $`git --work-tree=${this.workspaceDir} rev-parse --abbrev-ref HEAD`;

    try {
      await this._checkoutSha(sha);
      $`${this.bazelDiffPath} generate-hashes ${this.bazelDiffArgs} -w ${this.workspaceDir} -b ${this.bazelPath} ${this.hashesFile}`;
      await this._checkoutSha(currentBranch);
    } catch (error) {
      // make sure we checkout back to the current branch
      await this._checkoutSha(currentBranch);
      throw error;
    }

    return hashesFile;
  }

  async _generateImpactedTargets(sha, previousHashes, currentHashes, cache) {
    const impactedTargetsPath = `${this.hashesDir}/${sha}.impacted_targets.json`;

    if (cache && (await fileExists(impactedTargetsPath))) {
      return impactedTargetsPath;
    }

    $`${this.bazelDiffPath} get-impacted-targets -sh ${previousHashes} -fh ${currentHashes} -o ${impactedTargetsPath}`;

    return impactedTargetsPath;
  }

  async _checkoutSha(sha) {
    return await $`git --work-tree=${this.workspaceDir} checkout ${sha}`;
  }
}
