def get_executable_from_target(attr):
    executable = attr[DefaultInfo].files_to_run.executable
    if not executable:
        fail("{} is not an executable".format(attr))
    return executable
