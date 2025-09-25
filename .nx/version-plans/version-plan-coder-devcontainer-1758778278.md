---
coder-devcontainer: patch
---

Fix Home Assistant API token reference in Terraform configuration

- Change HA token access from `.credential` to `.password` for 1Password item
- This resolves authentication issues when accessing the Home Assistant API

This is a bug fix that corrects the proper field reference for extracting the HA token from 1Password.