import pkg from "@changesets/write";
const { default: write } = pkg;
import { rename, readdir } from "fs/promises";
import { fileExists } from "../utils.mjs";
import { path, $ } from "zx";

export default class ChangesetRepository {
  constructor({ workspaceDir, changesetDir, changesetBinaryPath }) {
    this.workspaceDir = workspaceDir;
    this.changesetDir = changesetDir;
    this.changesetBinaryPath = changesetBinaryPath;
    this.changesetExtension = ".md";
  }

  async getByName(name) {
    const changesetFiles = (await readdir(this.changesetDir))
      .filter((file) => {
        return (
          path.extname(file).toLowerCase() ===
          this.changesetExtension.toLowerCase()
        );
      })
      .map((file) => {
        return path.join(this.changesetDir, file);
      });

    return changesetFiles.find((file) => {
      return path.basename(file).startsWith(name);
    });
  }

  async writeChangeset({ name }) {
    let newFilePath = await this.getByName(name);

    if (newFilePath) {
      return newFilePath;
    }

    const changeset = {
      summary: "Generated update",
      releases: [{ name: name, type: "patch" }],
    };
    const uniqueId = await write(changeset, this.workspaceDir);
    const oldFilePath = path.join(this.changesetDir, `${uniqueId}.md`);
    newFilePath = path.join(
      this.changesetDir,
      `${name}-${uniqueId}${this.changesetExtension}`
    );

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
