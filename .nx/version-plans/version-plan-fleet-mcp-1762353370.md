---
fleet-mcp: patch
---

Refactor VCR testing strategy to improve reliability and performance

- Migrated from pytest-vcr to direct VCR.py usage for better control
- Created tests/record.py script for idempotent cassette recording outside pytest
- Refactored integration tests to eliminate timing hacks and is_recording checks
- Improved test execution speed from minutes to <1 second for integration tests
- Added comprehensive testing documentation in tests/TESTING.md
- Excluded contract tests from CI (they require live Coder instance)
- Fixed cassette recording to be deterministic and idempotent
