import argparse
import logging
import os
import time
from datetime import datetime

import parsedatetime
import psutil

from .utils import setup_logging, validate_timeout

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
        choices=["none", "debug", "info", "warning", "error", "critical"],
        default="debug",
        help="Log level for the server.",
    )

    args = parser.parse_args()

    setup_logging(args.log_level)

    LOGGER.debug("Arguments: %s", args)

    validate_timeout(args.timeout)

    server_pid = os.getpid()
    LOGGER.info(f"Server pid: {server_pid}")
    boot_pids = set([server_pid])
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
