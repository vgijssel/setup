def get_executable_from_target(attr):
    executable = attr[DefaultInfo].files_to_run.executable
    if not executable:
        fail("{} is not an executable".format(attr))
    return executable

# Turn a label into a fully qualified string removing
# the ~override suffix in case of locally overriden external repository
def label_to_string(label):
    if label.workspace_name == "":
        workspace_name = ""
    else:
        # TODO: Wonder if there is a better way to get the workspace name of a locally overriden external repository
        workspace_name = "@" + label.workspace_name.removesuffix("~override")

    return workspace_name + "//" + label.package + ":" + label.name
