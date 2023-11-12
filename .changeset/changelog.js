import changelogFunctions from "@changesets/changelog-github";

module.exports = {
  getReleaseLine: changelogFunctions.getReleaseLine,
  getDependencyReleaseLine: changelogFunctions.getDependencyReleaseLine,
};
