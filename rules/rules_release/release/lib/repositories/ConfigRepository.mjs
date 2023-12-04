import { path } from "zx";

export default class ConfigRepository {
  workspaceDir() {
    return process.env.BUILD_WORKSPACE_DIRECTORY;
  }

  tmpDir() {
    return path.join(this.workspaceDir(), "tmp");
  }

  changesetDir() {
    return path.join(this.workspaceDir(), ".changeset");
  }

  rulesReleaseDir() {
    return path.join(this.tmpDir(), "rules_release");
  }

  packagesDir() {
    return path.join(this.rulesReleaseDir(), "packages");
  }

  hashesDir() {
    return path.join(this.rulesReleaseDir(), "bazel_diff_hashes");
  }
}
