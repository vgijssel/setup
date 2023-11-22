import { cd } from "zx";

const workspaceDir = process.env.WORKSPACE_DIR;

cd(workspaceDir);

import("@changesets/cli").then(() => {});
