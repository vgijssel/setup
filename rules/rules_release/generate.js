const { runfiles } = require("@bazel/runfiles");
const { execSync } = require("child_process");
const removePrefix = (value, prefix) =>
  value.startsWith(prefix) ? value.slice(prefix.length) : value;
const workspace_name = removePrefix(process.env.WORKSPACE, "@");
const bazelDiffPath = runfiles.resolve(`${workspace_name}/bazel-diff`);
const workspaceDir = process.env.BUILD_WORKSPACE_DIRECTORY;
const hashesDir = `${workspaceDir}/tmp/bazel_diff_hashes`;
const { existsSync, mkdirSync } = require("fs");

if (!existsSync(hashesDir)) {
  mkdirSync(hashesDir, { recursive: true });
}

const getBazelPath = () => {
  const bazelCommand = `which bazel`;
  const bazelPath = execSync(bazelCommand, { encoding: "utf-8" }).trim();
  return bazelPath;
};

const bazelPath = getBazelPath();

const getCurrentBranch = () => {
  const gitCommand = `git --work-tree=${workspaceDir} rev-parse --abbrev-ref HEAD`;
  const currentBranch = execSync(gitCommand, { encoding: "utf-8" }).trim();
  return currentBranch;
};

const currentBranch = getCurrentBranch();

const getLatestMasterCommit = () => {
  const gitCommand = `git --work-tree=${workspaceDir} rev-parse master`;
  const latestCommitHash = execSync(gitCommand, { encoding: "utf-8" }).trim();
  return latestCommitHash;
};

const getCurrentCommit = () => {
  const gitCommand = `git --work-tree=${workspaceDir} rev-parse HEAD`;
  const currentCommitHash = execSync(gitCommand, { encoding: "utf-8" }).trim();
  return currentCommitHash;
};

const generateHashesForSha = (sha, cache) => {
  const hashesFile = `${hashesDir}/${sha}.json`;

  if (cache && existsSync(hashesFile)) {
    return hashesFile;
  }

  checkoutSha(sha);

  const bazelDiffCommand = `${bazelDiffPath} generate-hashes -w ${workspaceDir} -b ${bazelPath} ${hashesFile}`;
  execSync(bazelDiffCommand, {
    encoding: "utf-8",
  }).trim();

  checkoutSha(currentBranch);

  return hashesFile;
};

const checkoutSha = (sha) => {
  const gitCommand = `git --work-tree=${workspaceDir} checkout ${sha}`;
  execSync(gitCommand, {
    encoding: "utf-8",
  }).trim();
};

const generateImpactedTargets = (sha, previousHashes, currentHashes, cache) => {
  const impactedTargetsPath = `${hashesDir}/${sha}.impacted_targets.json`;

  if (cache && existsSync(impactedTargetsPath)) {
    return impactedTargetsPath;
  }

  const bazelDiffCommand = `${bazelDiffPath} get-impacted-targets -sh ${previousHashes} -fh ${currentHashes} -o ${impactedTargetsPath}`;

  execSync(bazelDiffCommand, {
    encoding: "utf-8",
  }).trim();

  return impactedTargetsPath;
};

const previousCommit = getLatestMasterCommit();
console.log(`previousCommit is ${previousCommit}`);

const currentCommit = getCurrentCommit();
console.log(`currentCommit is ${currentCommit}`);

const previousHashes = generateHashesForSha(previousCommit, true);
console.log(`previousHashes is ${previousHashes}`);

const currentHashes = generateHashesForSha(currentCommit, false);
console.log(`currentHashes is ${currentHashes}`);

const impactedTargets = generateImpactedTargets(
  currentCommit,
  previousHashes,
  currentHashes,
  false
);
console.log(`impactedTargets is ${impactedTargets}`);
