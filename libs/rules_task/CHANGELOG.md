# rules_task

## 2.2.1

### Patch Changes

- [#658](https://github.com/vgijssel/setup/pull/658) [`5d41466`](https://github.com/vgijssel/setup/commit/5d414664d045260d789642c4e414e0663a0ffcb9) Thanks [@mvgijssel](https://github.com/mvgijssel)! - fix: Propagate signal

## 2.2.0

### Minor Changes

- [#654](https://github.com/vgijssel/setup/pull/654) [`1a1d644`](https://github.com/vgijssel/setup/commit/1a1d6445a8ef8879bcc42182940b68692d92e908) Thanks [@mvgijssel](https://github.com/mvgijssel)! - feat: Support nested stamping

## 2.1.0

### Minor Changes

- [#652](https://github.com/vgijssel/setup/pull/652) [`2fc3870`](https://github.com/vgijssel/setup/commit/2fc387082badda15d0a7ca6c26cf5e3de9a463c8) Thanks [@mvgijssel](https://github.com/mvgijssel)! - feat: Support loading version file and info file into tasks

### Patch Changes

- [#652](https://github.com/vgijssel/setup/pull/652) [`2fc3870`](https://github.com/vgijssel/setup/commit/2fc387082badda15d0a7ca6c26cf5e3de9a463c8) Thanks [@mvgijssel](https://github.com/mvgijssel)! - chore(deps): Upgrade bazel_skylib and bazel_skylib

## 2.0.4

### Patch Changes

- [#650](https://github.com/vgijssel/setup/pull/650) [`a193f71`](https://github.com/vgijssel/setup/commit/a193f718231871c6d812518d08453ccdc580f0bb) Thanks [@mvgijssel](https://github.com/mvgijssel)! - docs: Add docs for rules_task

## 2.0.3

### Patch Changes

- [#648](https://github.com/vgijssel/setup/pull/648) [`6b838e3`](https://github.com/vgijssel/setup/commit/6b838e3a3ea1d188afb5b27dba831c5e6d0d7059) Thanks [@mvgijssel](https://github.com/mvgijssel)! - chore(deps): Upgrade Pytest, Pycov and rules_python

## 2.0.2

### Patch Changes

- [#623](https://github.com/vgijssel/setup/pull/623) [`9bc1487`](https://github.com/vgijssel/setup/commit/9bc1487bee5d8e5d3d070f974ef695ac7407ffd7) Thanks [@mvgijssel](https://github.com/mvgijssel)! - fix: Make command substitution actually fail

## 2.0.1

### Patch Changes

- [#617](https://github.com/vgijssel/setup/pull/617) [`951b11e`](https://github.com/vgijssel/setup/commit/951b11ef1110cbb6696e4cb8c9d4d738dba0a64a) Thanks [@mvgijssel](https://github.com/mvgijssel)! - build: Use `release_changed_files` instead of `bazel_diff_release` to detect changes for a release.

## 2.0.0

### Major Changes

- [#609](https://github.com/vgijssel/setup/pull/609) [`fb47806`](https://github.com/vgijssel/setup/commit/fb47806859895b5629f34c5c92a843b83967ab03) Thanks [@mvgijssel](https://github.com/mvgijssel)! - BREAKING CHANGE: Restructure the directory layout so it's the same as rules_release. This enables
  using development dependencies in the root BUILD.bazel file without having to install those
  when this rule is used in another repository.

### Patch Changes

- [#609](https://github.com/vgijssel/setup/pull/609) [`fb47806`](https://github.com/vgijssel/setup/commit/fb47806859895b5629f34c5c92a843b83967ab03) Thanks [@mvgijssel](https://github.com/mvgijssel)! - Replaced semantic release with rules_release release flow.
