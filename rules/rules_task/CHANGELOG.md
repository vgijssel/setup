# rules_task

## 2.0.0

### Major Changes

- [#609](https://github.com/vgijssel/setup/pull/609) [`fb47806`](https://github.com/vgijssel/setup/commit/fb47806859895b5629f34c5c92a843b83967ab03) Thanks [@mvgijssel](https://github.com/mvgijssel)! - BREAKING CHANGE: Restructure the directory layout so it's the same as rules_release. This enables
  using development dependencies in the root BUILD.bazel file without having to install those
  when this rule is used in another repository.

### Patch Changes

- [#609](https://github.com/vgijssel/setup/pull/609) [`fb47806`](https://github.com/vgijssel/setup/commit/fb47806859895b5629f34c5c92a843b83967ab03) Thanks [@mvgijssel](https://github.com/mvgijssel)! - Replaced semantic release with rules_release release flow.
