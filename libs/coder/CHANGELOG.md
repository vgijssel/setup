## 0.3.0 (2025-11-12)

### 🚀 Features

- Expose Coder using Tailscale funnel instead of serve ([#823](https://github.com/vgijssel/setup/pull/823))

## 0.2.0 (2025-10-08)

### 🚀 Features

- Add libs/coder with overmind orchestration and update devenv with overmind version test ([#767](https://github.com/vgijssel/setup/pull/767))

  - Created libs/coder nx project with "run" target using overmind
  - Installed overmind 2.5.1 via Hermit
  - Created Procfile for overmind to orchestrate coder server and tailscale serve
  - Added overmind version validation test to devenv goss.yaml