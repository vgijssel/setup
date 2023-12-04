import { stat } from "fs/promises";

export const fileExists = async (path) =>
  !!(await stat(path).catch((e) => false));
