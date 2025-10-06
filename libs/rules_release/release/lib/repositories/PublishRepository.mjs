import { $, path } from "zx";

export default class PublishRepository {
  constructor() {}

  async executeCmd(cmd) {
    const cwd = process.cwd();
    const executable = path.join(cwd, cmd);
    return await $`${executable}`;
  }
}
