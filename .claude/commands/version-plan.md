---
name: version-plan
description: Create version plans for changed projects
argument-hint: [High level description of changes]
---

## Plan

The goal is to have a clear description for each change for the release notes for each project. 

First determine which projects have changed and generate a versionplan for each changed project by running `nx release plan minor -m TBD --dry-run`.

Use git history to determine what has changed in each project and what type of change it is. A project can have multiple changes.

For each of the projects listed in the output create a version plan using a format like `.nx/version-plans/version-plan-<project>-<uniqueid>.md` where `<uniqueid>` is linux epoch time and <project> is the name of the project. There can be multiple files per project, depending on the number of changes. Ensure all file names are unique.

Inside the version plans make sure to mention the project name, the type of change ("major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease") and a clear description of the change. Example change looks like:

```markdown
---
devcontainer: minor
---

Add support for Node 20 in the devcontainer
```

Once this is done run `nx release plan:check` to validate if a version plan exists for each changed project. If the check fails redo the steps above until the check passes.

## User Input

```
$ARGUMENTS
```