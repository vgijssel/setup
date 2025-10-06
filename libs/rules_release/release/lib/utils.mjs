import { stat } from "fs/promises";
import { createHash } from "node:crypto";

export const fileExists = async (path) =>
  !!(await stat(path).catch((e) => false));

export const md5 = (content) => {
  return createHash("md5").update(content).digest("hex");
};
