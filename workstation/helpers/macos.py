from pyinfra import host
from pyinfra.api import operation, FactBase, FunctionCommand
from pyinfra.api.exceptions import OperationError
from pyinfra.facts.files import File
import json
import os
import datetime
import re


class DocumentObject():
    def __init__(self, data):
        self._data = data

    def mtime(self):
        # search tags for a string that starts with "mtime:"
        mtime_tag = next(tag for tag in self.tags() if tag.startswith('mtime:'))

        # If the tag is not found return None
        if mtime_tag is None:
            return None

        # remove the mtime: prefix from the string
        mtime_string = re.sub('mtime:', '', mtime_tag)

        # If the format of the tag is invalid return None
        try:
            mtime_datetime = datetime.datetime.fromisoformat(mtime_string)
        except ValueError:
            return None

        return mtime_datetime

    def tags(self):
        return self._data['tags']

    def __str__(self):
        return json.dumps(self._data)

class Document(FactBase):
    requires_command = "op"

    def command(self, path):
        return f'op --format json item get "{path}" 2> /dev/null || true'

    def process(self, output):
        document_string = ''.join(output)

        if len(document_string) == 0:
            return None

        return DocumentObject(json.loads(document_string))

def has_local_changed(local_info, remote_info):
    # if remote has invalid mtime (None) mark this as True 
    # this forces an update for the tags in the 1password document
    if remote_info.mtime() is None:
        return True

    return local_info['mtime'] > remote_info.mtime()

def has_remote_changed(local_info, remote_info):
    return remote_info.mtime() > local_info['mtime']

def update_file_mtime(state, host, file_path, mtime):
    epoch = mtime.timestamp()
    print(file_path, mtime, epoch)
    os.utime(file_path, (epoch, epoch))

def download_document(remote_file, remote_info, local_file):
    yield f'op document get "{remote_file}" --output {local_file}'
    mtime = remote_info.mtime() if remote_info.mtime() is not None else datetime.datetime.now()
    yield FunctionCommand(update_file_mtime, [local_file, mtime], {})

class DefaultsTypes():
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
            raise OperationError(f"Unknown defaults type {type(value)} for value {value}")


@operation
def default(domain, setting, value):
    defaults_type = get_defaults_type(value)
    yield f'defaults write {domain} "{setting}" {defaults_type} "{value}"'