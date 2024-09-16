def package_resource(name, source, output_files, description=None, tags=None):
    """
    From Pants Build Slack community: https://pantsbuild.slack.com/archives/C046T6T9U/p1724752064431699

    Macro which enables exposing a package target as a resource target.
    This is useful for example wanting to include an archive inside a pex_binary,
    but can be used for any packageable target.
    """
    if tags is None:
        tags = []

    shell_name = f"{name}.command"
    resource_name = name

    shell_command(
        name=shell_name,
        command="exit 0",
        workdir="/",
        output_files=output_files,
        execution_dependencies=[source],
    )

    experimental_wrap_as_resources(
        name=resource_name,
        description=description,
        tags=tags,
        inputs=[
            f":{shell_name}",
        ],
    )
