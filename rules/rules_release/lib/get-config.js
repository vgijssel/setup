const { readFile } = require("fs").promises;

class Config {
  constructor(releaseData) {
    this._releaseData = releaseData;
  }

  releaseNames() {
    return this._releaseData.releases.map((release) => release.name);
  }

  releaseLabels() {
    return this._releaseData.releases.map((release) => release.label);
  }

  workspaceDir() {
    return process.env.BUILD_WORKSPACE_DIRECTORY;
  }
}

const getConfig = async (configPaths) => {
  const releaseData = {
    releases: [],
  };

  for (const configPath of configPaths) {
    const config = JSON.parse(await readFile(configPath));
    releaseData.releases.push(config);
  }

  const config = new Config(releaseData);
  return config;
};

module.exports = getConfig;
