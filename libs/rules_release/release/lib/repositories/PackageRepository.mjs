import { readFile, writeFile, mkdir } from "fs/promises";
import { fileExists } from "../utils.mjs";
import { path } from "zx";

export default class PackageRepository {
  constructor({ packagesDir }) {
    this.packagesDir = packagesDir;
  }

  async write({ name, version, deps }) {
    const packagePath = this.getPathByName(name);
    const packageDir = path.dirname(packagePath);

    if (!(await fileExists(packageDir))) {
      await mkdir(packageDir, { recursive: true });
    }

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
    return packagePath;
  }

  async getContentByName(name) {
    const packagePath = this.getPathByName(name);
    return JSON.parse(await readFile(packagePath, "utf-8"));
  }

  getPathByName(name) {
    return path.join(this.packagesDir, name, "package.json");
  }
}
