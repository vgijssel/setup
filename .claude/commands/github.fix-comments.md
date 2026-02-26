---
description: Read PR comments, create Task Master tasks for each, and work through them systematically
---

Process all comments from a GitHub pull request and systematically address them using Task Master.

**Usage:** `/github.fix-comments [PR_NUMBER]`

If no PR number is provided, use the PR associated with the current branch.

## Steps

1. **Fetch PR Information**
   - If $ARGUMENTS is provided, use it as the PR number
   - If no arguments, get the current branch with `git branch --show-current`
   - Get the PR number for the current branch using `gh pr view --json number -q .number`
   - Fetch all PR comments using `gh pr view <PR_NUMBER> --json comments,reviews -q '.comments,.reviews[].comments[]' --jq`

2. **Parse and Categorize Comments**
   - Extract all review comments and regular comments
   - Filter out any comments that are:
     - Already resolved or marked as done
     - Just general positive feedback without actionable items
     - Duplicate comments about the same issue
   - For each actionable comment, note:
     - The comment body/content
     - The file path (if applicable)
     - The line number (if applicable)
     - The commenter's username

3. **Create Task Master Tasks**
   - For each actionable PR comment, create a task using `task-master add-task`:
     ```bash
     task-master add-task --prompt="Fix PR comment from @<username>: <comment_summary>.
     File: <file_path>, Line: <line_number>.
     Full comment: <comment_body>"
     ```
   - Keep track of all created task IDs

4. **Expand Tasks**
   - For each created task, expand it into subtasks using:
     ```bash
     task-master expand --id=<task_id> --research
     ```
   - This will break down each comment fix into actionable subtasks

5. **Work Through Tasks Using Orchestrator**
   - Launch the task-master orchestrator subagent to work through all tasks:
   ```
   Use the Task tool with subagent_type="taskmaster:task-orchestrator" to coordinate execution of all created tasks
   ```
   - The orchestrator will:
     - Analyze task dependencies
     - Identify tasks that can be worked on in parallel
     - Deploy task-executor agents as needed
     - Track progress and completion

6. **Report Progress**
   - After orchestration completes, run `task-master list` to show final status
   - Summarize what was addressed from the PR comments
   - If any tasks failed or are blocked, report those specifically

## Important Notes

- The orchestrator will automatically handle task dependencies and parallel execution
- Use `--research` flag when expanding tasks for better analysis
- Each PR comment becomes a separate task for better tracking
- Comments without actionable items should be skipped
- If a comment suggests multiple changes, the expand step will create appropriate subtasks
- The orchestrator agent has access to all tools needed to complete the implementation

## Example

For a PR with comments about:
1. "Please add error handling to the login function"
2. "The variable name `x` should be more descriptive"
3. "Looks good!" (non-actionable, skip this)

This will create 2 tasks, expand them into subtasks, and systematically work through all changes.
