import ReleaseRepository from "../repositories/ReleaseRepository.mjs";
import PublishRepository from "../repositories/PublishRepository.mjs";

export default class PublishAction {
  constructor({ configPaths, publishCmds }) {
    this.configPaths = configPaths;
    this.publishCmds = publishCmds;
  }

  async execute() {
    const releaseRepository = new ReleaseRepository(this.configPaths);
    const publishRepository = new PublishRepository();
    const releases = await releaseRepository.getAll();

    for (const release of releases) {
      for (const publishCmd of release.publish_cmds) {
        await publishRepository.executeCmd(publishCmd);
      }
    }

    for (const cmd of this.publishCmds) {
      await publishRepository.executeCmd(cmd);
    }
  }
}
