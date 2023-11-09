import { readFile } from "fs/promises";

export default class VersionRepository {
  constructor(configPaths) {}

  async getByFile(filePath) {
    return await readFile(filePath, "utf-8");
  }
}
