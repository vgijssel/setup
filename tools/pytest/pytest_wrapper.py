import sys

import pytest


def main() -> None:
    args = sys.argv[1:]
    pytest_exit_code = pytest.main(args)
    sys.exit(pytest_exit_code)


if __name__ == "__main__":
    main()
