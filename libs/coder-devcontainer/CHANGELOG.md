## 0.7.7 (2025-10-06)

### 🧱 Updated Dependencies

- Updated devcontainer to 0.6.6

## 0.7.6 (2025-10-02)

### 🧱 Updated Dependencies

- Updated devcontainer to 0.6.5

## 0.7.5 (2025-09-30)

### 🧱 Updated Dependencies

- Updated devcontainer to 0.6.4

## 0.7.4 (2025-09-25)

### 🧱 Updated Dependencies

- Updated devcontainer to 0.6.3

## 0.7.3 (2025-09-25)

### 🩹 Fixes

- Add NX_KEY support to coder-devcontainer template ([#733](https://github.com/vgijssel/setup/pull/733))

  - Add extraction of NX_KEY from 1Password for build caching
  - Add corresponding coder_env resource to expose NX_KEY to workspace
  - Includes data source validation with postconditions
  This enhancement enables Nx remote caching in Coder workspaces.

## 0.7.2 (2025-09-25)

### 🩹 Fixes

- Refactor Terraform checks to use postconditions ([#737](https://github.com/vgijssel/setup/pull/737))

## 0.7.1 (2025-09-25)

### 🩹 Fixes

- Add NX_KEY environment variable support ([#736](https://github.com/vgijssel/setup/pull/736))

## 0.7.0 (2025-09-24)

### 🚀 Features

- Update documentation and clean up configuration ([#726](https://github.com/vgijssel/setup/pull/726), [#728](https://github.com/vgijssel/setup/issues/728))
- Add HA_TOKEN environment variable from 1Password to Coder workspace ([#726](https://github.com/vgijssel/setup/pull/726), [#728](https://github.com/vgijssel/setup/issues/728))

### 🧱 Updated Dependencies

- Updated devcontainer to 0.6.2

## 0.6.0 (2025-09-22)

### 🚀 Features

- Enable git commit signing support in Coder devcontainer with SSH agent forwarding and Docker socket configuration ([#725](https://github.com/vgijssel/setup/pull/725))

### 🧱 Updated Dependencies

- Updated devcontainer to 0.6.1

## 0.5.0 (2025-09-21)

### 🚀 Features

- Add 1Password integration for GitHub token (GH_TOKEN) environment variable using coder_env resource ([#724](https://github.com/vgijssel/setup/pull/724))

### 🩹 Fixes

- Pass coder prompt to Claude Code ([#724](https://github.com/vgijssel/setup/pull/724))
- Upgrade Coder from version 2.25.2 to 2.26.0 ([#724](https://github.com/vgijssel/setup/pull/724))

### 🧱 Updated Dependencies

- Updated devcontainer to 0.6.0

## 0.4.0 (2025-09-21)

### 🚀 Features

- Remove git configuration and commit signing from Coder devcontainer template and add Claude module for Coder to enable tasks ([#722](https://github.com/vgijssel/setup/pull/722))

### 🧱 Updated Dependencies

- Updated devcontainer to 0.5.0

## 0.3.0 (2025-09-20)

### 🚀 Features

- Enable Claude Code integration with automatic configuration injection, add AGENTS.md and CLAUDE.md project documentation, and update 1Password item references ([#721](https://github.com/vgijssel/setup/pull/721))

### 🧱 Updated Dependencies

- Updated devcontainer to 0.4.0

## 0.2.0 (2025-09-17)

### 🚀 Features

- Fix devcontainer image version reference and update Git clone URL to use SSH for authentication ([#720](https://github.com/vgijssel/setup/pull/720))

### 🧱 Updated Dependencies

- Updated devcontainer to 0.3.0

## 0.1.0 (2025-09-17)

### 🚀 Features

- Add support for Coder template integration with devcontainer setup ([#719](https://github.com/vgijssel/setup/pull/719))

### 🧱 Updated Dependencies

- Updated devcontainer to 0.2.0

## 0.0.3 (2025-09-17)

### 🧱 Updated Dependencies

- Updated devcontainer to 0.1.2

## 0.0.2 (2025-09-16)

### 🧱 Updated Dependencies

- Updated devcontainer to 0.1.1

## 0.0.1 (2025-09-16)

### 🧱 Updated Dependencies

- Updated devcontainer to 0.1.0