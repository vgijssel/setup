const { execSync } = require("child_process");
const { existsSync, mkdirSync, readFileSync } = require("fs");

const getBazelPath = () => {
  const bazelCommand = `which bazel`;
  const bazelPath = execSync(bazelCommand, { encoding: "utf-8" }).trim();
  return bazelPath;
};

const getCurrentBranch = (workspaceDir) => {
  const gitCommand = `git --work-tree=${workspaceDir} rev-parse --abbrev-ref HEAD`;
  const currentBranch = execSync(gitCommand, { encoding: "utf-8" }).trim();
  return currentBranch;
};

const getLatestMasterCommit = (workspaceDir) => {
  const gitCommand = `git --work-tree=${workspaceDir} rev-parse master`;
  const latestCommitHash = execSync(gitCommand, { encoding: "utf-8" }).trim();
  return latestCommitHash;
};

const getCurrentCommit = (workspaceDir) => {
  const gitCommand = `git --work-tree=${workspaceDir} rev-parse HEAD`;
  const currentCommitHash = execSync(gitCommand, { encoding: "utf-8" }).trim();
  return currentCommitHash;
};

const generateHashesForSha = ({
  bazelDiffPath,
  bazelDiffArgs,
  bazelPath,
  workspaceDir,
  hashesDir,
  sha,
  cache,
}) => {
  const hashesFile = `${hashesDir}/${sha}.json`;

  if (cache && existsSync(hashesFile)) {
    return hashesFile;
  }

  const currentBranch = getCurrentBranch();

  try {
    checkoutSha(workspaceDir, sha);

    const bazelDiffCommand = `${bazelDiffPath} generate-hashes ${bazelDiffArgs} -w ${workspaceDir} -b ${bazelPath} ${hashesFile}`;
    console.log(bazelDiffCommand);
    execSync(bazelDiffCommand, {
      encoding: "utf-8",
    }).trim();

    checkoutSha(workspaceDir, currentBranch);
  } catch (error) {
    // make sure we checkout back to the current branch
    checkoutSha(workspaceDir, currentBranch);
    throw error;
  }

  return hashesFile;
};

const checkoutSha = (workspaceDir, sha) => {
  const gitCommand = `git --work-tree=${workspaceDir} checkout ${sha}`;
  execSync(gitCommand, {
    encoding: "utf-8",
  }).trim();
};

const generateImpactedTargets = ({
  bazelDiffPath,
  hashesDir,
  sha,
  previousHashes,
  currentHashes,
  cache,
}) => {
  const impactedTargetsPath = `${hashesDir}/${sha}.impacted_targets.json`;

  if (cache && existsSync(impactedTargetsPath)) {
    return impactedTargetsPath;
  }

  const bazelDiffCommand = `${bazelDiffPath} get-impacted-targets -sh ${previousHashes} -fh ${currentHashes} -o ${impactedTargetsPath}`;
  console.log(bazelDiffCommand);

  execSync(bazelDiffCommand, {
    encoding: "utf-8",
  }).trim();

  return impactedTargetsPath;
};

const getImpactedTargets = ({ bazelDiffPath, bazelDiffArgs, workspaceDir }) => {
  const hashesDir = `${workspaceDir}/tmp/bazel_diff_hashes`;

  if (!existsSync(hashesDir)) {
    mkdirSync(hashesDir, { recursive: true });
  }
  const bazelPath = getBazelPath();
  const previousCommit = getLatestMasterCommit();

  console.log(`previousCommit is ${previousCommit}`);

  const currentCommit = getCurrentCommit();
  console.log(`currentCommit is ${currentCommit}`);

  const previousHashes = generateHashesForSha({
    bazelDiffPath,
    bazelDiffArgs,
    workspaceDir,
    hashesDir,
    bazelPath,
    sha: previousCommit,
    cache: true,
  });
  console.log(`previousHashes is ${previousHashes}`);

  const currentHashes = generateHashesForSha({
    bazelDiffPath,
    bazelDiffArgs,
    workspaceDir,
    hashesDir,
    bazelPath,
    sha: currentCommit,
    cache: false,
  });
  console.log(`currentHashes is ${currentHashes}`);

  const impactedTargets = generateImpactedTargets({
    bazelDiffPath,
    hashesDir,
    currentCommit,
    previousHashes,
    currentHashes,
    cache: false,
  });
  console.log(`impactedTargets is ${impactedTargets}`);
  const data = readFileSync(impactedTargets, "utf8");
  const result = data.split("\n");
  return result;
};

module.exports = getImpactedTargets;
