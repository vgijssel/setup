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

@operation
def sync(local_file, remote_file, vault):
    if os.environ['CI'] == 'true':
        host.noop(f"onepassword.sync does not work in the CI yet. Skipping.")
        return

    local_info = host.get_fact(File, path=local_file)
    remote_info = host.get_fact(Document, path=remote_file)

    # Not a file?!
    if local_info is False:
        raise OperationError(f"{local_file} exists and is not a file")

    if local_info is None and remote_info is None:
        raise OperationError(f"Both local {local_file} and remote {remote_file} don't exist")

    if local_info is None:
        download_document(remote_file, remote_info, local_file)

    # upload the local file and set the local mtime
    elif remote_info is None:
        mtime = local_info['mtime'].isoformat()
        yield f"cat {local_file} | op document create --file-name '{remote_file}' --title '{remote_file}' --tags mtime:{mtime} --vault {vault}"

    # update the remote file using the local file content
    elif has_local_changed(local_info, remote_info):
        mtime = local_info['mtime'].isoformat()
        yield f"cat {local_file} | op document edit '{remote_file}' --file-name '{remote_file}' --title '{remote_file}' --tags mtime:{mtime} --vault {vault}"

    # update the local file
    elif has_remote_changed(local_info, remote_info):
        download_document(remote_file, remote_info, local_file)

    else:
        host.noop(f"local {local_file} and remote {remote_file} are in sync.")