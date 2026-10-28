## 1.0.1 (2025-12-21)

### 🩹 Fixes

- Update project configuration to cache build outputs ([#859](https://github.com/vgijssel/setup/pull/859))

# 1.0.0 (2025-09-25)

### ⚠️  Breaking changes

- Migrate docs folder to apps/docs following Nx monorepo structure ([#733](https://github.com/vgijssel/setup/pull/733))

  - Move all documentation files from root-level docs/ to apps/docs/
  - Update mkdocs.yml configuration to point to new location
  - Add Nx project configuration with build and serve targets
  - Remove pants
  - Format configuration files according to project standards
  This is a breaking change as it restructures the documentation project to follow Nx monorepo conventions and best practices.
