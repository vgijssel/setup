import argparse
import logging
import sys
import time
from datetime import datetime

import parsedatetime
import psutil

LOGGER = logging.getLogger(__name__)


def main():
    parser = argparse.ArgumentParser(description="Delegator server tool.")
    parser.add_argument(
        "--timeout",
        default="1 minute",
        help="Set a timeout when the server terminates.",
    )
    parser.add_argument(
        "--poll-interval",
        default=1,
        type=int,
        help="Set the poll interval in seconds.",
    )
    parser.add_argument(
        "--log-level",
        choices=["debug", "info", "warning", "error", "critical"],
        default="debug",
        help="Name of the base image to use for the delegator container.",
    )

    args = parser.parse_args()

    log_level_map = {
        "debug": logging.DEBUG,
        "info": logging.INFO,
        "warning": logging.WARNING,
        "error": logging.ERROR,
        "critical": logging.CRITICAL,
        None: None,
    }

    log_level = log_level_map[args.log_level]

    logging.basicConfig(
        level=log_level,
        format="%(asctime)s.%(msecs)02d [%(levelname)s] %(message)s",
        datefmt="%I:%M:%S",
        handlers=[logging.StreamHandler(sys.stderr)],
    )

    boot_pids = set(psutil.pids())
    LOGGER.info(f"Boot pids: {boot_pids}")

    cal = parsedatetime.Calendar()
    timeout_datetime, status = cal.parseDT(args.timeout)

    while True:
        current_datetime = datetime.now()
        current_pids = set(psutil.pids())
        new_pids = current_pids - boot_pids

        if len(new_pids) > 0:
            LOGGER.info(
                f"New pids detected {new_pids} increasing timeout by {args.timeout}"
            )
            timeout_datetime, status = cal.parseDT(args.timeout)

        if current_datetime > timeout_datetime:
            LOGGER.info("Timeout reached. Exiting.")
            exit(0)
        else:
            seconds_until_timeout = (
                timeout_datetime - current_datetime
            ).total_seconds()
            LOGGER.info(f"{seconds_until_timeout} seconds until server shutdown.")

        time.sleep(args.poll_interval)


if __name__ == "__main__":
    main()
