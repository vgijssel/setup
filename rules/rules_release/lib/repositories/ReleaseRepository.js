const { readFile } = require("fs").promises;

class ReleaseRepository {
  constructor(configPaths) {
    this.configPaths = configPaths;
    this._releases = null;
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

module.exports = ReleaseRepository;
