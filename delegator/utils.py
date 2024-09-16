import logging
import sys

import parsedatetime


def validate_timeout(timeout: str) -> None:
    cal = parsedatetime.Calendar()
    _timeout_datetime, status = cal.parseDT(timeout)
    if status != 2:
        print(
            f"Invalid timeout format: {timeout}. Try something like: `10m` or `4 hours`"
        )
        exit(1)


def setup_logging(log_level):
    log_level_map = {
        "debug": logging.DEBUG,
        "info": logging.INFO,
        "warning": logging.WARNING,
        "error": logging.ERROR,
        "critical": logging.CRITICAL,
        "none": None,
    }

    log_level = log_level_map[log_level]

    logging.basicConfig(
        level=log_level,
        format="%(asctime)s.%(msecs)02d [%(levelname)s] %(message)s",
        datefmt="%I:%M:%S",
        handlers=[logging.StreamHandler(sys.stderr)],
    )
