# rules_release

## 2.0.2

### Patch Changes

- [#652](https://github.com/vgijssel/setup/pull/652) [`2fc3870`](https://github.com/vgijssel/setup/commit/2fc387082badda15d0a7ca6c26cf5e3de9a463c8) Thanks [@mvgijssel](https://github.com/mvgijssel)! - chore(deps): Upgrade bazel_skylib and bazel_skylib

- Updated dependencies [[`2fc3870`](https://github.com/vgijssel/setup/commit/2fc387082badda15d0a7ca6c26cf5e3de9a463c8), [`2fc3870`](https://github.com/vgijssel/setup/commit/2fc387082badda15d0a7ca6c26cf5e3de9a463c8)]:
  - rules_task@2.1.0

## 2.0.1

### Patch Changes

- [#648](https://github.com/vgijssel/setup/pull/648) [`6b838e3`](https://github.com/vgijssel/setup/commit/6b838e3a3ea1d188afb5b27dba831c5e6d0d7059) Thanks [@mvgijssel](https://github.com/mvgijssel)! - chore(deps): Upgrade rules_python to 0.29.0

- Updated dependencies [[`6b838e3`](https://github.com/vgijssel/setup/commit/6b838e3a3ea1d188afb5b27dba831c5e6d0d7059)]:
  - rules_task@2.0.3

## 2.0.0

### Major Changes

- [#636](https://github.com/vgijssel/setup/pull/636) [`e304c19`](https://github.com/vgijssel/setup/commit/e304c19bcb6c09f1ef2d219f1982d39f4209353e) Thanks [@mvgijssel](https://github.com/mvgijssel)! - BREAKING CHANGE: Rename `bazel_diff_release` to `release_bazel_diff`

### Minor Changes

- [#636](https://github.com/vgijssel/setup/pull/636) [`e304c19`](https://github.com/vgijssel/setup/commit/e304c19bcb6c09f1ef2d219f1982d39f4209353e) Thanks [@mvgijssel](https://github.com/mvgijssel)! - feat: Add release_bazel_differ

## 1.2.1

### Patch Changes

- [#623](https://github.com/vgijssel/setup/pull/623) [`9bc1487`](https://github.com/vgijssel/setup/commit/9bc1487bee5d8e5d3d070f974ef695ac7407ffd7) Thanks [@mvgijssel](https://github.com/mvgijssel)! - fix: Make command substitution actually fail

- Updated dependencies [[`9bc1487`](https://github.com/vgijssel/setup/commit/9bc1487bee5d8e5d3d070f974ef695ac7407ffd7)]:
  - rules_task@2.0.2

## 1.2.0

### Minor Changes

- [#617](https://github.com/vgijssel/setup/pull/617) [`951b11e`](https://github.com/vgijssel/setup/commit/951b11ef1110cbb6696e4cb8c9d4d738dba0a64a) Thanks [@mvgijssel](https://github.com/mvgijssel)! - feat: Enable passing `previous_revision_cmd` and `final_revision_cmd` to `bazel_diff_release`

- [#617](https://github.com/vgijssel/setup/pull/617) [`951b11e`](https://github.com/vgijssel/setup/commit/951b11ef1110cbb6696e4cb8c9d4d738dba0a64a) Thanks [@mvgijssel](https://github.com/mvgijssel)! - feat: Add `release_changed_files` to enable releasing based on changed file paths inside of git

- [#617](https://github.com/vgijssel/setup/pull/617) [`951b11e`](https://github.com/vgijssel/setup/commit/951b11ef1110cbb6696e4cb8c9d4d738dba0a64a) Thanks [@mvgijssel](https://github.com/mvgijssel)! - feat: Support changing git directories better by stashing and restoring the working directory

### Patch Changes

- [#617](https://github.com/vgijssel/setup/pull/617) [`951b11e`](https://github.com/vgijssel/setup/commit/951b11ef1110cbb6696e4cb8c9d4d738dba0a64a) Thanks [@mvgijssel](https://github.com/mvgijssel)! - fix: Fix passing multiple arguments to generate-hashes and get-impacted-targets

- Updated dependencies [[`951b11e`](https://github.com/vgijssel/setup/commit/951b11ef1110cbb6696e4cb8c9d4d738dba0a64a)]:
  - rules_task@2.0.1

## 1.1.0

### Minor Changes

- [#616](https://github.com/vgijssel/setup/pull/616) [`286ea6d`](https://github.com/vgijssel/setup/commit/286ea6d51987fe66961fd06a5d7c30d51063ebcb) Thanks [@mvgijssel](https://github.com/mvgijssel)! - feat: Added `publish_oci_image` rule to publish OCI images to a registry.

## 1.0.0

### Major Changes

- [#612](https://github.com/vgijssel/setup/pull/612) [`3f6eca4`](https://github.com/vgijssel/setup/commit/3f6eca4c03214e021cc333fecd466abea67bd1a3) Thanks [@mvgijssel](https://github.com/mvgijssel)! - BREAKING CHANGE: Extracted bazel-diff from release manager and introduced `bazel_diff_release` rule.

- [#612](https://github.com/vgijssel/setup/pull/612) [`3f6eca4`](https://github.com/vgijssel/setup/commit/3f6eca4c03214e021cc333fecd466abea67bd1a3) Thanks [@mvgijssel](https://github.com/mvgijssel)! - BREAKING CHANGE: Move `bazel_diff_release` and `publish_github_release` from release/defs.bzl to tools/defs.bzl.

### Patch Changes

- [#612](https://github.com/vgijssel/setup/pull/612) [`3f6eca4`](https://github.com/vgijssel/setup/commit/3f6eca4c03214e021cc333fecd466abea67bd1a3) Thanks [@mvgijssel](https://github.com/mvgijssel)! - build: Updated release template to include WORKSPACE setup

- [#612](https://github.com/vgijssel/setup/pull/612) [`3f6eca4`](https://github.com/vgijssel/setup/commit/3f6eca4c03214e021cc333fecd466abea67bd1a3) Thanks [@mvgijssel](https://github.com/mvgijssel)! - test: Add integration test for a WORKSPACE setup

## 0.1.0

### Minor Changes

- [#609](https://github.com/vgijssel/setup/pull/609) [`fb47806`](https://github.com/vgijssel/setup/commit/fb47806859895b5629f34c5c92a843b83967ab03) Thanks [@mvgijssel](https://github.com/mvgijssel)! - Add publish_github_release to make publishing GitHub releases easier.

### Patch Changes

- [#609](https://github.com/vgijssel/setup/pull/609) [`fb47806`](https://github.com/vgijssel/setup/commit/fb47806859895b5629f34c5c92a843b83967ab03) Thanks [@mvgijssel](https://github.com/mvgijssel)! - Setup release flow for rules_release

- Updated dependencies [[`fb47806`](https://github.com/vgijssel/setup/commit/fb47806859895b5629f34c5c92a843b83967ab03), [`fb47806`](https://github.com/vgijssel/setup/commit/fb47806859895b5629f34c5c92a843b83967ab03)]:
  - rules_task@2.0.0
