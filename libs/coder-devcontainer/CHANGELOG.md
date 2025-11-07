## 0.14.1 (2025-11-07)

### 🧱 Updated Dependencies

- Updated devcontainer to 0.7.1

## 0.14.0 (2025-11-06)

### 🚀 Features

- Replace nohup with Supervisord for fleet-mcp server process management ([#803](https://github.com/vgijssel/setup/pull/803))

### 🧱 Updated Dependencies

- Updated devcontainer to 0.7.0

## 0.13.5 (2025-11-06)

### 🧱 Updated Dependencies

- Updated devcontainer to 0.6.17

## 0.13.4 (2025-11-05)

### 🩹 Fixes

- Fix fleet-mcp Coder app URL path ([#797](https://github.com/vgijssel/setup/pull/797))

## 0.13.3 (2025-11-04)

### 🧱 Updated Dependencies

- Updated devcontainer to 0.6.16

## 0.13.2 (2025-11-04)

### 🩹 Fixes

- Enable dangerously_skip_permissions for claude-code module to bypass permission prompts in trusted development environments ([#796](https://github.com/vgijssel/setup/pull/796))

## 0.13.1 (2025-11-04)

### 🩹 Fixes

- Use main branch for coder template ([#795](https://github.com/vgijssel/setup/pull/795))

## 0.13.0 (2025-11-04)

### 🚀 Features

- feat: Add HTTP server support with uvicorn for fleet-mcp and integrate with Coder devcontainer ([#792](https://github.com/vgijssel/setup/pull/792))

## 0.12.0 (2025-11-03)

### 🚀 Features

- feat: add researcher workspace preset with deep research system prompt ([#793](https://github.com/vgijssel/setup/pull/793))

## 0.11.0 (2025-10-30)

### 🚀 Features

- Add workspace presets for specialized AI agent roles ([#791](https://github.com/vgijssel/setup/pull/791))

  This adds two new Coder workspace presets that provide specialized system prompts for different use cases:
  1. "Coder" preset - Optimized for software development tasks with focus on implementing features, writing tests, and maintaining code quality
  2. "Operator" preset - Optimized for incident investigation and troubleshooting with focus on diagnostics, root cause analysis, and SRE practices
  These presets allow users to quickly create workspaces tailored for specific workflows without manually configuring system prompts.

## 0.10.0 (2025-10-29)

### 🚀 Features

- Add PR and agent metadata fields to coder-devcontainer template ([#789](https://github.com/vgijssel/setup/pull/789))

## 0.9.0 (2025-10-28)

### 🚀 Features

- Add display_apps configuration to Coder agent ([#788](https://github.com/vgijssel/setup/pull/788))

## 0.8.4 (2025-10-27)

### 🧱 Updated Dependencies

- Updated devcontainer to 0.6.15

## 0.8.3 (2025-10-27)

### 🧱 Updated Dependencies

- Updated devcontainer to 0.6.14

## 0.8.2 (2025-10-26)

### 🧱 Updated Dependencies

- Updated devcontainer to 0.6.13

## 0.8.1 (2025-10-20)

### 🩹 Fixes

- Remove unused docker_socket variable from coder-devcontainer ([#774](https://github.com/vgijssel/setup/pull/774))

  The docker_socket variable and its associated provider configuration were unused and have been removed to simplify the configuration.

## 0.8.0 (2025-10-18)

### 🚀 Features

- Add OP_SERVICE_ACCOUNT_TOKEN environment variable from 1Password ([#771](https://github.com/vgijssel/setup/pull/771))

## 0.7.13 (2025-10-18)

### 🧱 Updated Dependencies

- Updated devcontainer to 0.6.12

## 0.7.12 (2025-10-08)

### 🧱 Updated Dependencies

- Updated devcontainer to 0.6.11

## 0.7.11 (2025-10-07)

### 🧱 Updated Dependencies

- Updated devcontainer to 0.6.10

## 0.7.10 (2025-10-06)

### 🧱 Updated Dependencies

- Updated devcontainer to 0.6.9

## 0.7.9 (2025-10-06)

### 🧱 Updated Dependencies

- Updated devcontainer to 0.6.8

## 0.7.8 (2025-10-06)

### 🧱 Updated Dependencies

- Updated devcontainer to 0.6.7

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