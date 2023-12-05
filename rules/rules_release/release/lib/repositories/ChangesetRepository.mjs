import pkg from "@changesets/write";
const { default: write } = pkg;
import { rename, readdir, mkdir } from "fs/promises";
import { path, $ } from "zx";
import { fileExists } from "../utils.mjs";

export default class ChangesetRepository {
  constructor({ workspaceDir, changesetDir, changesetBinaryPath }) {
    this.workspaceDir = workspaceDir;
    this.changesetDir = changesetDir;
    this.changesetBinaryPath = changesetBinaryPath;
    this.changesetExtension = ".md";
  }

  async getByName(name) {
    await this._ensureChangesetDir();

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
    await this._ensureChangesetDir();

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
    await this._ensureChangesetDir();

    // NOTE: this is necessary so changesets find the changelog module like "@changesets/changelog-github"
    // inside of .changeset/config.json.
    const nodeModulesPath = path.join(
      process.env.JS_BINARY__RUNFILES,
      process.env.WORKSPACE_NAME,
      "node_modules"
    );
    process.env.NODE_PATH = nodeModulesPath;
    process.env.WORKSPACE_DIR = this.workspaceDir;

    await $`${this.changesetBinaryPath} version`;
  }

  async _ensureChangesetDir() {
    if (!(await fileExists(this.changesetDir))) {
      await mkdir(this.changesetDir, { recursive: true });
    }
  }
}
