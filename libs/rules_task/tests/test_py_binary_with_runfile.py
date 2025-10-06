import runfiles

r = runfiles.Create()


def _rlocation_to_path(rlocation):
    p = r.Rlocation(rlocation)

    if not p:
        raise Exception("Unable to find runfile: {}".format(rlocation))

    return p


# get file content
def _get_file_content(path):
    with open(path, "r") as file:
        return file.read()


content = _get_file_content(_rlocation_to_path("rules_task/tests/files/test_file.txt"))

print(f"from python: {content}")
