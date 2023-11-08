class ConfigRepository {
  workspaceDir() {
    return process.env.BUILD_WORKSPACE_DIRECTORY;
  }
}

module.exports = ConfigRepository;
