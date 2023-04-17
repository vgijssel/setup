import sys
import json


def main() -> None:
    print(sys.argv)

    _, operations_file = sys.argv

    with open(operations_file) as f:
        operations = json.load(f)

    print(operations)


if __name__ == "__main__":
    main()
