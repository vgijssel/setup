import pkg from "@changesets/write";
const { default: write } = pkg;
import { rename } from "fs/promises";
import { fileExists } from "../utils.mjs";

export default class ChangesetRepository {
  constructor({ workspaceDir }) {
    this.workspaceDir = workspaceDir;
    this.changesetDir = `${this.workspaceDir}/.changeset`;
  }

  async writeChangeset({ name }) {
    const newFilePath = `${this.changesetDir}/${name}.md`;

    if (await fileExists(newFilePath)) {
      return newFilePath;
    }

    const changeset = {
      summary: "A change",
      releases: [{ name: name, type: "minor" }],
    };
    const uniqueId = await write(changeset, this.workspaceDir);
    const oldFilePath = `${this.changesetDir}/${uniqueId}.md`;

    await rename(oldFilePath, newFilePath);
    return newFilePath;
  }
}
