---
description: Run the linter and fix all reported issues
---

It's IMPORTANT that lint and formatting configuration is only added to Trunk, globally, and not on a per-project basis.
ENSURE Trunk is the only source of truth for linting and formatting configuration.
Run `trunk check` to collect a list of linting issues in the codebase. 
Review the output and fix all the reported issues. 
Create a task for each category of issues and fix each category one by one. 
After you have fixed a category, run `trunk check` again to ensure that the issues have been resolved before moving on to the next category.