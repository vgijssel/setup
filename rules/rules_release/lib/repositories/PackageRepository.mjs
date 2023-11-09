import { writeFile, mkdir } from "fs/promises";
import { fileExists } from "../utils.mjs";
import { path } from "zx";

export default class PackageRepository {
  constructor({ packagesDir }) {
    this.packagesRootDir = packagesDir;
    this.packagesDir = path.join(packagesDir, "packages");
  }

  async writeRoot() {
    if (!(await fileExists(this.packagesRootDir))) {
      await mkdir(this.packagesRootDir, { recursive: true });
    }

    const packagePath = path.join(this.packagesRootDir, "package.json");

    const content = {
      name: "root",
      version: "0.0.0",
      private: true,
      dependencies: {},
      workspaces: ["packages/*"],
    };

    await writeFile(packagePath, JSON.stringify(content, null, 2));
  }

  async write({ name, version, deps }) {
    const packageDir = path.join(this.packagesDir, name);

    if (!(await fileExists(packageDir))) {
      await mkdir(packageDir, { recursive: true });
    }

    const packagePath = path.join(packageDir, "package.json");

    const content = {
      name: name,
      version: version,
      private: true,
      dependencies: {},
    };

    for (const dep of deps) {
      content.dependencies[dep] = "*";
    }

    await writeFile(packagePath, JSON.stringify(content, null, 2));
  }
}
