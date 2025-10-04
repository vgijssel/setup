import { readFile, writeFile } from "fs/promises";

export default class VersionRepository {
  constructor() {}

  async getByFile(filePath) {
    return await readFile(filePath, "utf-8");
  }

  async updateByFile(filePath, newVersion) {
    return await writeFile(filePath, newVersion);
  }
}
