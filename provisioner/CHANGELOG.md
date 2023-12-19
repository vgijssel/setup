# provisioner

## 1.0.1

### Patch Changes

- [#617](https://github.com/vgijssel/setup/pull/617) [`951b11e`](https://github.com/vgijssel/setup/commit/951b11ef1110cbb6696e4cb8c9d4d738dba0a64a) Thanks [@mvgijssel](https://github.com/mvgijssel)! - fix: Update timeout of bunq2ynab to prevent 1password rate limit

- [#617](https://github.com/vgijssel/setup/pull/617) [`951b11e`](https://github.com/vgijssel/setup/commit/951b11ef1110cbb6696e4cb8c9d4d738dba0a64a) Thanks [@mvgijssel](https://github.com/mvgijssel)! - chore(deps): Update teleport to 14.2.3

- [#617](https://github.com/vgijssel/setup/pull/617) [`951b11e`](https://github.com/vgijssel/setup/commit/951b11ef1110cbb6696e4cb8c9d4d738dba0a64a) Thanks [@mvgijssel](https://github.com/mvgijssel)! - fix: Ensure nix-build is available inside GitHub actions

- Updated dependencies [[`951b11e`](https://github.com/vgijssel/setup/commit/951b11ef1110cbb6696e4cb8c9d4d738dba0a64a)]:
  - rules_task@2.0.1

## 1.0.0

### Major Changes

- [#616](https://github.com/vgijssel/setup/pull/616) [`286ea6d`](https://github.com/vgijssel/setup/commit/286ea6d51987fe66961fd06a5d7c30d51063ebcb) Thanks [@mvgijssel](https://github.com/mvgijssel)! - BREAKING CHANGE: Remove microk8s from provisioner as it's not used and is only consuming resources.

### Minor Changes

- [#616](https://github.com/vgijssel/setup/pull/616) [`286ea6d`](https://github.com/vgijssel/setup/commit/286ea6d51987fe66961fd06a5d7c30d51063ebcb) Thanks [@mvgijssel](https://github.com/mvgijssel)! - feat: Deploy bunq2ynab image in dev, test and prod using different images and credentials!

### Patch Changes

- Updated dependencies [[`286ea6d`](https://github.com/vgijssel/setup/commit/286ea6d51987fe66961fd06a5d7c30d51063ebcb), [`286ea6d`](https://github.com/vgijssel/setup/commit/286ea6d51987fe66961fd06a5d7c30d51063ebcb)]:
  - bunq2ynab@0.2.0
