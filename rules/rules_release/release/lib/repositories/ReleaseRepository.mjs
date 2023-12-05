import { $ } from "zx";
import { readFile } from "fs/promises";

export default class ReleaseRepository {
  constructor(configPaths) {
    this.configPaths = configPaths;
    this._releases = null;
  }

  async getAll() {
    return await this._getData();
  }

  async getChangedReleases() {
    const releases = await this._getData();
    const changedReleases = [];

    for (const release of releases) {
      const hasChanged = await $`${release.change_cmd}`;

      const output = hasChanged.stdout.trim().toLowerCase();

      if (output !== "true" && output !== "false") {
        throw new Error(
          `Change command ${release.change_cmd} for release ${release.name} must return true or false, but returned ${output}`
        );
      }

      if (hasChanged.stdout.trim().toLowerCase() === "true") {
        changedReleases.push(release);
      }
    }

    return changedReleases;
  }

  async getAllLabels() {
    return (await this._getData()).map((release) => release.label);
  }

  async getByLabel(label) {
    return (await this._getData()).find((release) => release.label === label);
  }

  async _getData() {
    if (this._releases !== null) {
      return this._releases;
    }

    const releases = [];

    for (const configPath of this.configPaths) {
      const config = JSON.parse(await readFile(configPath));
      releases.push(config);
    }

    this._releases = releases;
    return this._releases;
  }
}
