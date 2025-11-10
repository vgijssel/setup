## 0.13.0 (2025-11-07)

### 🚀 Features

- Refactor terminal environment variables into shared dot_terminal_env.sh.tmpl file ([#809](https://github.com/vgijssel/setup/pull/809))

  - Create new `dot_terminal_env.sh.tmpl` to centralize shared environment variables
  - Source shared environment file from both `dot_bashrc` and `dot_zshrc.tmpl`
  - Remove duplicate environment variable declarations from both shell configs
  - Remove `ll` alias (already provided by zimrc modules)

## 0.12.2 (2025-11-06)

### 🩹 Fixes

- Replace nohup with Supervisord for fleet-mcp server process management ([#803](https://github.com/vgijssel/setup/pull/803))

## 0.12.1 (2025-11-06)

### 🩹 Fixes

- Update Coder version requirement to >=2.27.3 in devenv tests ([#806](https://github.com/vgijssel/setup/pull/806))

## 0.12.0 (2025-11-04)

### 🚀 Features

- feat(devenv): Prevent .DS_Store on external drives ([#798](https://github.com/vgijssel/setup/pull/798))

## 0.11.4 (2025-10-27)

### 🩹 Fixes

- Add HackerOne Atlassian URLs to Profile 2 browser routing ([#782](https://github.com/vgijssel/setup/pull/782))

## 0.11.3 (2025-10-27)

### 🩹 Fixes

- Set UV_LINK_MODE=copy on Linux to avoid symlink issues ([#779](https://github.com/vgijssel/setup/pull/779))

## 0.11.2 (2025-10-26)

### 🩹 Fixes

- Add dnsutils package to provide nslookup for DNS testing in Chainsaw tests ([#768](https://github.com/vgijssel/setup/pull/768))

## 0.11.1 (2025-10-18)

### 🩹 Fixes

- chore(devenv): update Coder CLI to v2.27.1 ([#769](https://github.com/vgijssel/setup/pull/769))

## 0.11.0 (2025-10-08)

### 🚀 Features

- Add libs/coder with overmind orchestration and update devenv with overmind version test ([#767](https://github.com/vgijssel/setup/pull/767))

  - Created libs/coder nx project with "run" target using overmind
  - Installed overmind 2.5.1 via Hermit
  - Created Procfile for overmind to orchestrate coder server and tailscale serve
  - Added overmind version validation test to devenv goss.yaml

## 0.10.5 (2025-10-07)

### 🩹 Fixes

- Re-enable VSCode extension installation after upstream issue resolution ([#765](https://github.com/vgijssel/setup/pull/765))

  The VSCode CLI hanging issue (https://github.com/microsoft/vscode/issues/269737) has been resolved, so we can now re-enable the automatic installation of VSCode extensions from the extensions.json file.

## 0.10.4 (2025-10-06)

### 🩹 Fixes

- Add zsh history file initialization to fix fzf-history-widget error ([#764](https://github.com/vgijssel/setup/pull/764))

## 0.10.3 (2025-10-06)

### 🩹 Fixes

- chore(devenv): upgrade coder CLI to 2.26.1 and add version validation ([#760](https://github.com/vgijssel/setup/pull/760), [#759](https://github.com/vgijssel/setup/issues/759))

## 0.10.2 (2025-10-06)

### 🩹 Fixes

- feat(devenv): add Claude desktop to macOS Homebrew packages ([#757](https://github.com/vgijssel/setup/pull/757))

## 0.10.1 (2025-10-06)

### 🩹 Fixes

- fix: disable VSCode extension installation temporarily ([#753](https://github.com/vgijssel/setup/pull/753))

## 0.10.0 (2025-10-02)

### 🚀 Features

- Add Nx IDE configuration to disable automatic console extension installation ([#746](https://github.com/vgijssel/setup/pull/746))

## 0.9.0 (2025-09-30)

### 🚀 Features

- Add Coder Desktop and Motion apps to Homebrew cask packages ([#743](https://github.com/vgijssel/setup/pull/743))

## 0.8.1 (2025-09-25)

### 🩹 Fixes

- Add push.autoSetupRemote=true to gitconfig ([#741](https://github.com/vgijssel/setup/pull/741))

## 0.8.0 (2025-09-24)

### 🚀 Features

- Make sure gitconfig is merged with existing config for Coder Workspaces. ([#726](https://github.com/vgijssel/setup/pull/726), [#728](https://github.com/vgijssel/setup/issues/728))

## 0.7.0 (2025-09-22)

### 🚀 Features

- Refactor git configuration management to support platform-specific includes and improve chezmoi template handling ([#725](https://github.com/vgijssel/setup/pull/725))

## 0.6.0 (2025-09-21)

### 🚀 Features

- Add wait-for-git script to orchestrate Coder script execution and ensure proper Git repository initialization ([#724](https://github.com/vgijssel/setup/pull/724))

## 0.5.0 (2025-09-21)

### 🚀 Features

- Remove git commit signing configuration and update SSH known hosts management ([#722](https://github.com/vgijssel/setup/pull/722))

## 0.4.0 (2025-09-20)

### 🚀 Features

- Add global Claude Code binary availability in development environment and update goss validation tests for Claude Code configuration ([#721](https://github.com/vgijssel/setup/pull/721))

## 0.3.0 (2025-09-17)

### 🚀 Features

- Add SSH known hosts validation for GitHub connectivity in Linux devcontainer environments ([#720](https://github.com/vgijssel/setup/pull/720))

## 0.2.0 (2025-09-17)

### 🚀 Features

- Remove devenv project.json as part of package.json migration ([#719](https://github.com/vgijssel/setup/pull/719))