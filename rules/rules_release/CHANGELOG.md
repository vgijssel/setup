# rules_release

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
