from __future__ import annotations

import datetime
import logging

_LOGGER = logging.getLogger(__name__)


def to_num(s):
    try:
        return int(s)
    except ValueError:
        try:
            return float(s)
        except ValueError:
            return None


def value_to_type(init_val, dest_type):  # noqa: C901

    if init_val is None or (
        isinstance(init_val, str)
        and init_val.lower() in ["", "none", "unknown", "unavailable"]
    ):
        _LOGGER.debug(f"[value_to_type] value: {init_val}, returning None")
        return None

    _LOGGER.debug(
        f"[value_to_type] initial value: {init_val}, initial type: {type(init_val)}, dest type: {dest_type}"
    )
    if isinstance(init_val, str):
        if dest_type is None or dest_type == "string":
            _LOGGER.debug(
                f"[value_to_type] return value: {init_val}, type: {type(init_val)}"
            )
            return init_val

        elif dest_type == "date":
            try:
                value_date = datetime.date.fromisoformat(init_val)
            except ValueError:
                _LOGGER.debug(
                    f"Cannot convert string to {dest_type}: {init_val}, returning None"
                )
                raise ValueError(f"Cannot convert string to {dest_type}: {init_val}")
                return None
            else:
                _LOGGER.debug(
                    f"[value_to_type] return value: {value_date}, type: {type(value_date)}"
                )
                return value_date

        elif dest_type == "datetime":
            try:
                value_datetime = datetime.datetime.fromisoformat(init_val)
            except ValueError:
                _LOGGER.debug(
                    f"Cannot convert string to {dest_type}: {init_val}, returning None"
                )
                raise ValueError(f"Cannot convert string to {dest_type}: {init_val}")
                return None
            else:
                _LOGGER.debug(
                    f"[value_to_type] return value: {value_datetime}, type: {type(value_datetime)}"
                )
                return value_datetime

        elif dest_type == "number":
            if (value_num := to_num(init_val)) is not None:
                _LOGGER.debug(
                    f"[value_to_type] return value: {value_num}, type: {type(value_num)}"
                )
                return value_num
            else:
                _LOGGER.debug(
                    f"Cannot convert string to {dest_type}: {init_val}, returning None"
                )
                raise ValueError(f"Cannot convert string to {dest_type}: {init_val}")
        else:
            _LOGGER.debug(f"Invalid dest_type: {dest_type}, returning None")
            raise ValueError(f"Invalid dest_type: {dest_type}")
            return None
    elif isinstance(init_val, int) or isinstance(init_val, float):
        if dest_type is None or dest_type == "string":
            _LOGGER.debug(
                f"[value_to_type] return value: {str(init_val)}, type: {type(str(init_val))}"
            )
            return str(init_val)
        elif dest_type == "date":
            try:
                value_date = datetime.date.fromisoformat(str(init_val))
            except ValueError:
                _LOGGER.debug(
                    f"Cannot convert number to {dest_type}: {init_val}, returning None"
                )
                raise ValueError(f"Cannot convert number to {dest_type}: {init_val}")
                return None
            else:
                _LOGGER.debug(
                    f"[value_to_type] return value: {value_date}, type: {type(value_date)}"
                )
                return value_date

        elif dest_type == "datetime":
            try:
                value_datetime = datetime.datetime.fromisoformat(str(init_val))
            except ValueError:
                _LOGGER.debug(
                    f"Cannot convert number to {dest_type}: {init_val}, returning None"
                )
                raise ValueError(f"Cannot convert number to {dest_type}: {init_val}")
                return None
            else:
                _LOGGER.debug(
                    f"[value_to_type] return value: {value_datetime}, type: {type(value_datetime)}"
                )
                return value_datetime
        elif dest_type == "number":
            _LOGGER.debug(
                f"[value_to_type] return value: {init_val}, type: {type(init_val)}"
            )
            return init_val
        else:
            _LOGGER.debug(f"Invalid dest_type: {dest_type}, returning None")
            raise ValueError(f"Invalid dest_type: {dest_type}")
            return None
    elif isinstance(init_val, datetime.date):
        if dest_type is None or dest_type == "string":
            _LOGGER.debug(
                f"[value_to_type] return value: {init_val.isoformat()}, type: {type(init_val.isoformat())}"
            )
            return init_val.isoformat()
        elif dest_type == "date":
            _LOGGER.debug(
                f"[value_to_type] return value: {init_val}, type: {type(init_val)}"
            )
            return init_val
        elif dest_type == "datetime":
            _LOGGER.debug(
                f"[value_to_type] return value: {datetime.datetime.combine(init_val, datetime.time.min)}, "
                + f"type: {type(datetime.datetime.combine(init_val, datetime.time.min))}"
            )
            return datetime.datetime.combine(init_val, datetime.time.min)
        elif dest_type == "number":
            _LOGGER.debug(
                f"[value_to_type] return value: {datetime.datetime.combine(init_val, datetime.time.min).timestamp()}, "
                + f"type: {type(datetime.datetime.combine(init_val, datetime.time.min).timestamp())}"
            )
            return datetime.datetime.combine(init_val, datetime.time.min).timestamp()
        else:
            _LOGGER.debug(f"Invalid dest_type: {dest_type}, returning None")
            raise ValueError(f"Invalid dest_type: {dest_type}")
            return None
    elif isinstance(init_val, datetime.datetime):
        if dest_type is None or dest_type == "string":
            _LOGGER.debug(
                f"[value_to_type] return value: {init_val.isoformat()}, type: {type(init_val.isoformat())}"
            )
            return init_val.isoformat()
        elif dest_type == "date":
            _LOGGER.debug(
                f"[value_to_type] return value: {init_val.date()}, type: {type(init_val.date())}"
            )
            return init_val.date()
        elif dest_type == "datetime":
            _LOGGER.debug(
                f"[value_to_type] return value: {init_val}, type: {type(init_val)}"
            )
            return init_val
        elif dest_type == "number":
            _LOGGER.debug(
                f"[value_to_type] return value: {init_val.timestamp()}, type: {type(init_val.timestamp())}"
            )
            return init_val.timestamp()
        else:
            _LOGGER.debug(f"Invalid dest_type: {dest_type}, returning None")
            raise ValueError(f"Invalid dest_type: {dest_type}")
            return None
    else:
        _LOGGER.debug(f"Invalid initial type: {type(init_val)}, returning None")
        raise ValueError(f"Invalid initial type: {type(init_val)}")
        return None
