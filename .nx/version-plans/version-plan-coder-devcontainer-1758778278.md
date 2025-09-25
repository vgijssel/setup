---
coder-devcontainer: patch
---

Add NX_KEY support to coder-devcontainer template

- Add extraction of NX_KEY from 1Password for build caching
- Add corresponding coder_env resource to expose NX_KEY to workspace
- Includes data source validation with postconditions

This enhancement enables Nx remote caching in Coder workspaces.