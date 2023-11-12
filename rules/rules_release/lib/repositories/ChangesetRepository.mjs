import pkg from "@changesets/write";
const { default: write } = pkg;
import { rename } from "fs/promises";
import { fileExists } from "../utils.mjs";
import { path, $ } from "zx";

export default class ChangesetRepository {
  constructor({ workspaceDir, changesetDir, changesetBinaryPath }) {
    this.workspaceDir = workspaceDir;
    this.changesetDir = changesetDir;
    this.changesetBinaryPath = changesetBinaryPath;
  }

  async writeChangeset({ name }) {
    const newFilePath = path.join(this.changesetDir, `${name}.md`);

    if (await fileExists(newFilePath)) {
      return newFilePath;
    }

    const changeset = {
      summary: "A change",
      releases: [{ name: name, type: "minor" }],
    };
    const uniqueId = await write(changeset, this.workspaceDir);
    const oldFilePath = path.join(this.changesetDir, `${uniqueId}.md`);

    await rename(oldFilePath, newFilePath);
    return newFilePath;
  }

  async updateVersions() {
    const nodeModulesPath = path.join(
      process.env.JS_BINARY__RUNFILES,
      process.env.WORKSPACE_NAME,
      "node_modules"
    );
    process.env.NODE_PATH = nodeModulesPath;

    process.env.WORKSPACE_DIR = this.workspaceDir;

    await $`${this.changesetBinaryPath} version`;
  }
}
