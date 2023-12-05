import { mkdir, readFile } from "fs/promises";
import { $, which } from "zx";
import { fileExists } from "../../../release/lib/utils.mjs";

export default class BazelDiffRepository {
  constructor({
    bazelDiffPath,
    generateHashesExtraArgs,
    getImpactedTargetsExtraArgs,
    workspaceDir,
    hashesDir,
    previousRevision,
    finalRevision,
  }) {
    this.bazelDiffPath = bazelDiffPath;
    this.generateHashesExtraArgs = generateHashesExtraArgs;
    this.getImpactedTargetsExtraArgs = getImpactedTargetsExtraArgs;
    this.workspaceDir = workspaceDir;
    this.hashesDir = hashesDir;
    this.previousRevision = previousRevision;
    this.finalRevision = finalRevision;
  }

  async getImpactedTargets() {
    if (!(await fileExists(this.hashesDir))) {
      mkdir(this.hashesDir, { recursive: true });
    }

    const previousCommit = this.previousRevision;
    const currentCommit = this.finalRevision;

    const previousHashes = await this._generateHashesForSha(
      previousCommit,
      true
    );

    const currentHashes = await this._generateHashesForSha(
      currentCommit,
      false
    );

    const impactedTargets = await this._generateImpactedTargets(
      currentCommit,
      previousHashes,
      currentHashes,
      false
    );

    const data = await readFile(impactedTargets, "utf8");
    const result = data.split("\n");
    return result;
  }

  async _generateHashesForSha(sha, cache) {
    const hashesFile = `${this.hashesDir}/${sha}.json`;
    const bazelPath = await which("bazel");

    if (cache && (await fileExists(hashesFile))) {
      return hashesFile;
    }

    const currentBranch =
      await $`git --work-tree=${this.workspaceDir} rev-parse --abbrev-ref HEAD`;

    try {
      await this._checkoutSha(sha);
      await $`${this.bazelDiffPath} generate-hashes ${this.bazelDiffArgs} -w ${this.workspaceDir} -b ${bazelPath} ${hashesFile}`;
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

    await $`${this.bazelDiffPath} get-impacted-targets -sh ${previousHashes} -fh ${currentHashes} -o ${impactedTargetsPath}`;

    return impactedTargetsPath;
  }

  async _checkoutSha(sha) {
    return await $`git --work-tree=${this.workspaceDir} checkout ${sha}`;
  }
}
