---
description: Implement a prompt in a new branch with automated PR creation and CI monitoring
---

Implement the following prompt: $ARGUMENTS

After implementing the prompt, follow these steps:

1. Check the current branch using `git branch --show-current`
   - If on main branch: Create a new git branch for the change using a descriptive name based on the work done
   - If on a different branch: Check if it's attached to a PR using `gh pr view --json url,state`
     - If attached to a PR: Skip branch creation and use the existing branch
     - If not attached to a PR: Create a new git branch for the change
2. Commit all changes with an appropriate commit message
3. Push the branch to the remote repository
4. Check if a PR already exists using `gh pr view --json url,state`
   - If a PR exists: Report the existing PR URL and skip PR creation
   - If no PR exists: Create a GitHub pull request for the change with a clear title and description
5. Report the GitHub pull request URL
6. Monitor CI status using `gh pr checks --watch`
7. If there are problems with the CI, analyze the failures, make fixes, commit and push the changes, then return to step 6
8. Once CI passes successfully, report completion

Important notes:
- Use `git status` and `git diff` to understand what changes were made
- Create a meaningful branch name that reflects the changes (e.g., `feat/add-feature`, `fix/bug-description`)
- Write a clear commit message following conventional commit format
- Ensure the PR description explains what was changed and why
- Keep iterating on CI fixes until all checks pass
- Do not give up on CI failures - debug and fix them
- Avoid creating unnecessary branches when already working on a feature branch with a PR
