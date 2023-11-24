---
"rules_task": major
---

BREAKING CHANGE: Restructure the directory layout so it's the same as rules_release. This enables
using development dependencies in the root BUILD.bazel file without having to install those
when this rule is used in another repository.
