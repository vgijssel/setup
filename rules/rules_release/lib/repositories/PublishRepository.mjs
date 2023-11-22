import { $ } from "zx";

export default class PublishRepository {
  constructor() {}

  async executeCmd(cmd) {
    return await $`${cmd}`;
  }
}
