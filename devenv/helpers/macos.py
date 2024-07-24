from pyinfra.api import operation
from pyinfra.api.exceptions import OperationError


class DefaultsTypes:
    INT = int
    FLOAT = float
    BOOL = bool


def get_defaults_type(value):
    match type(value):
        case DefaultsTypes.INT:
            return "-int"
        case DefaultsTypes.FLOAT:
            return "-float"
        case DefaultsTypes.BOOL:
            return "-bool"
        case _:
            raise OperationError(
                f"Unknown defaults type {type(value)} for value {value}"
            )


@operation()
def default(domain, setting, value):
    defaults_type = get_defaults_type(value)
    yield f'defaults write {domain} "{setting}" {defaults_type} "{value}"'
