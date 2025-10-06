"""Utility functions for release rules."""

def get_executable_from_target(attr):
    """Extract executable from a target attribute.

    Args:
        attr: Target attribute to extract executable from

    Returns:
        The executable file
    """
    executable = attr[DefaultInfo].files_to_run.executable
    if not executable:
        fail("{} is not an executable".format(attr))
    return executable

def label_to_string(label):
    """Convert a label to a fully qualified string.

    Removes the ~override suffix in case of locally overridden external repository.

    Args:
        label: Label to convert to string

    Returns:
        Fully qualified label string
    """
    if label.workspace_name == "":
        workspace_name = ""
    else:
        # TODO: Wonder if there is a better way to get the workspace name of a locally overriden external repository
        workspace_name = "@" + label.workspace_name.removesuffix("~override")

    return workspace_name + "//" + label.package + ":" + label.name
