---
docs: major
---

Migrate docs folder to apps/docs following Nx monorepo structure

- Move all documentation files from root-level docs/ to apps/docs/
- Update mkdocs.yml configuration to point to new location
- Add Nx project configuration with build and serve targets
- Remove pants
- Format configuration files according to project standards

This is a breaking change as it restructures the documentation project to follow Nx monorepo conventions and best practices.