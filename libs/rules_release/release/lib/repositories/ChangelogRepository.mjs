import { readFile, writeFile } from "fs/promises";
import { path } from "zx";

export default class ChangelogRepository {
  constructor() {
    this.changesetChangelogFile = "CHANGELOG.md";
  }

  async write(dir, changelogFile) {
    const changelogContent = await readFile(changelogFile, "utf-8");
    const filePath = path.join(dir, this.changesetChangelogFile);
    await writeFile(filePath, changelogContent, "utf-8");
    return filePath;
  }

  async copyBackIntoFile(dir, changelogFile) {
    const filePath = path.join(dir, this.changesetChangelogFile);
    const newContent = await readFile(filePath, "utf-8");
    await writeFile(changelogFile, newContent, "utf-8");
    return changelogFile;
  }
}
